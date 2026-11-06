<?php
// Administration des réalisations de Rap Énergies : ajouter, modifier, réordonner, retirer les photos de la galerie
// « Nos chantiers ». Un mot de passe (haché dans admin/config.php), session sécurisée, jeton anti-CSRF, limitation
// des essais de connexion. Pensée pour un téléphone. Voir lib.php pour les données, les images et la galerie.
declare(strict_types=1);
require __DIR__ . '/lib.php';
ini_set('display_errors', '0');
ini_set('memory_limit', '1024M');
set_time_limit(120);

const DUREE_INACTIVITE = 30 * 60;
const ESSAIS_MAX = 5;
const BLOCAGE = 15 * 60;

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
session_name('rap_admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
ini_set('session.use_strict_mode', '1');
session_start();
if (!empty($_SESSION['connecte'])) {
    if (time() - (int)($_SESSION['activite'] ?? 0) > DUREE_INACTIVITE) { session_unset(); session_destroy(); session_start(); $_SESSION['flash'] = ['info', 'Déconnexion après 30 minutes sans activité. Reconnectez-vous.']; }
    else $_SESSION['activite'] = time();
}
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf'];
$connecte = !empty($_SESSION['connecte']);
$config = charger_config();
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');

function rediriger(string $url = './'): never { header('Location: ' . $url, true, 303); exit; }
function flash(string $type, string $message, string $url = './'): never { $_SESSION['flash'] = [$type, $message]; rediriger($url); }

/* ---------- Limitation des essais de connexion, par adresse, dans un petit fichier ---------- */
function essais_lire(): array { $d = is_file(FICHIER_ESSAIS) ? json_decode((string)file_get_contents(FICHIER_ESSAIS), true) : null; return is_array($d) ? $d : []; }
function essais_ecrire(array $d): void {
    foreach ($d as $k => $v) if (($v['jusqua'] ?? 0) < time() - 86400) unset($d[$k]);
    $tmp = FICHIER_ESSAIS . '.' . bin2hex(random_bytes(3)) . '.tmp';
    if (file_put_contents($tmp, json_encode($d), LOCK_EX) !== false) rename($tmp, FICHIER_ESSAIS); else @unlink($tmp);
}
function bloque_jusqua(string $ip): int { $e = essais_lire()[$ip] ?? null; return ($e && ($e['n'] ?? 0) >= ESSAIS_MAX && ($e['jusqua'] ?? 0) > time()) ? (int)$e['jusqua'] : 0; }
function noter_echec(string $ip): void {
    $d = essais_lire(); $e = $d[$ip] ?? ['n' => 0, 'jusqua' => 0];
    if (($e['jusqua'] ?? 0) < time() && ($e['n'] ?? 0) >= ESSAIS_MAX) $e = ['n' => 0, 'jusqua' => 0];
    $e['n']++; $e['jusqua'] = time() + BLOCAGE;
    $d[$ip] = $e; essais_ecrire($d);
}
function oublier_echecs(string $ip): void { $d = essais_lire(); unset($d[$ip]); essais_ecrire($d); }

/* ---------- Lecture d'une fiche envoyée ---------- */
function lire_fiche(array $post, ?array $existante, array $liste): array {
    // Un envoi qui ne serait pas en UTF-8 (outil en ligne de commande sous Windows) est converti plutôt que vidé.
    $champ = function (string $n) use ($post): string {
        $v = (string)($post[$n] ?? '');
        if (!mb_check_encoding($v, 'UTF-8')) $v = mb_convert_encoding($v, 'UTF-8', 'Windows-1252');
        return mb_substr(trim((string)preg_replace('/\s+/u', ' ', $v)), 0, 200);
    };
    $equipement = isset(EQUIPEMENTS[$champ('equipement')]) ? $champ('equipement') : 'panneaux';
    $position = $champ('position');
    if (!preg_match('/^\d{1,3}% \d{1,3}%$/', $position)) $position = '50% 50%';
    $p = [
        'fichier' => $existante['fichier'] ?? null,
        'equipement' => $equipement,
        'titre' => $champ('titre') !== '' ? $champ('titre') : EQUIPEMENTS[$equipement],
        'lieu' => $champ('lieu'),
        'commune' => $champ('commune'),
        'detail' => $champ('detail'),
        'alt' => $champ('alt'),
        'position' => $position,
        'provisoire' => !empty($post['provisoire']),
    ];
    if ($p['lieu'] === '' || $p['commune'] === '' || $p['alt'] === '') throw new InvalidArgumentException('Le lieu, la commune et le texte alternatif sont obligatoires.');
    if (!$p['fichier']) $p['fichier'] = slug_unique(slug($p['titre'] . '-' . $p['lieu'] . '-' . $p['commune']), $liste, null);
    return $p;
}
function photo_envoyee(): ?array {
    $f = $_FILES['photo'] ?? null;
    if (!$f || !is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE || ($f['size'] ?? 0) === 0) return null;
    if (in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) throw new InvalidArgumentException('Cette photo est trop lourde (25 Mo au plus).');
    if ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) throw new InvalidArgumentException("La photo n'a pas été reçue en entier. Réessayez.");
    return $f;
}

/* ---------- Actions ---------- */
$erreurFiche = null; $ficheEnCours = null; $indexEnCours = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string)($_POST['action'] ?? '');
    if (!hash_equals($csrf, (string)($_POST['csrf'] ?? ''))) flash('erreur', 'La page a expiré. Rechargez-la et recommencez.');

    if ($action === 'connexion') {
        if (!$config) flash('erreur', "L'administration n'est pas encore configurée : le mot de passe n'a pas été installé sur le serveur.");
        if ($jusqua = bloque_jusqua($ip)) flash('erreur', "Trop d'essais. Réessayez dans " . max(1, (int)ceil(($jusqua - time()) / 60)) . ' minutes.');
        usleep(300000);
        if (password_verify((string)($_POST['mot_de_passe'] ?? ''), (string)$config['mot_de_passe_hache'])) {
            oublier_echecs($ip);
            session_regenerate_id(true);
            $_SESSION['connecte'] = true; $_SESSION['activite'] = time(); $_SESSION['csrf'] = bin2hex(random_bytes(32));
            rediriger('./');
        }
        noter_echec($ip);
        flash('erreur', 'Mot de passe incorrect.');
    }
    if (!$connecte) flash('erreur', 'Connectez-vous pour continuer.');

    if ($action === 'deconnexion') {
        session_unset(); session_destroy();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/admin/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
        rediriger('./');
    }
    if ($action === 'regenerer') {
        try { reecrire_index(charger()); } catch (Throwable $e) { flash('erreur', $e->getMessage()); }
        flash('ok', 'La galerie du site a été régénérée.');
    }
    if ($action === 'enregistrer') {
        $liste = charger();
        $i = (string)($_POST['i'] ?? 'nouvelle');
        $existante = $i === 'nouvelle' ? null : ($liste[(int)$i] ?? null);
        if ($i !== 'nouvelle' && !$existante) flash('erreur', 'Réalisation introuvable.');
        try {
            $p = lire_fiche($_POST, $existante, $liste);
            $photo = photo_envoyee();
            if (!$existante && !$photo) throw new InvalidArgumentException('Une photo est nécessaire pour une nouvelle réalisation.');
            if ($photo) traiter_image($photo['tmp_name'], $p['fichier']);
            $liste = modifier(function (array $l) use ($p, $i) { if ($i === 'nouvelle') $l[] = $p; else $l[(int)$i] = $p; return $l; });
            reecrire_index($liste);
            flash('ok', $i === 'nouvelle' ? 'Réalisation ajoutée : elle est en ligne dans la galerie.' : 'Réalisation enregistrée : la galerie du site est à jour.');
        } catch (InvalidArgumentException $e) {
            $erreurFiche = $e->getMessage();
            $ficheEnCours = array_merge($existante ?? ['equipement' => 'panneaux', 'position' => '50% 50%'], array_intersect_key($_POST, array_flip(['equipement', 'titre', 'lieu', 'commune', 'detail', 'alt', 'position'])), ['provisoire' => !empty($_POST['provisoire'])]);
            $indexEnCours = $i;
        } catch (Throwable $e) {
            error_log('admin rap-energies : ' . $e->getMessage());
            flash('erreur', "L'enregistrement a échoué : " . $e->getMessage());
        }
    }
    if ($action === 'supprimer' || $action === 'monter' || $action === 'descendre') {
        $i = (int)($_POST['i'] ?? -1);
        try {
            $retiree = null;
            $liste = modifier(function (array $l) use ($i, $action, &$retiree) {
                if (!isset($l[$i])) throw new InvalidArgumentException('Réalisation introuvable (la liste a peut-être changé).');
                if ($action === 'supprimer') { [$retiree] = array_splice($l, $i, 1); return $l; }
                $j = $action === 'monter' ? $i - 1 : $i + 1;
                if (isset($l[$j])) [$l[$i], $l[$j]] = [$l[$j], $l[$i]];
                return $l;
            });
            if ($retiree) { supprimer_derives((string)$retiree['fichier']); mettre_a_la_corbeille((string)$retiree['fichier']); }
            reecrire_index($liste);
        } catch (InvalidArgumentException $e) { flash('erreur', $e->getMessage()); }
        catch (Throwable $e) { error_log('admin rap-energies : ' . $e->getMessage()); flash('erreur', "L'opération a échoué : " . $e->getMessage()); }
        flash('ok', $action === 'supprimer' ? 'Réalisation retirée du site.' : 'Ordre modifié.');
    }
    if ($erreurFiche === null) flash('erreur', 'Action inconnue.');
}

/* ---------- Page ---------- */
$flash = $_SESSION['flash'] ?? null; unset($_SESSION['flash']);
$page = (string)($_GET['page'] ?? 'liste');
$liste = $connecte ? charger() : [];
if ($erreurFiche !== null) { $page = 'fiche'; $flash = ['erreur', $erreurFiche]; }
$fiche = null; $indexFiche = null;
if ($connecte && $page === 'fiche') {
    $indexFiche = $indexEnCours ?? (string)($_GET['i'] ?? 'nouvelle');
    if ($indexFiche !== 'nouvelle' && !isset($liste[(int)$indexFiche])) { $page = 'liste'; $flash = ['erreur', 'Réalisation introuvable.']; }
    else $fiche = $ficheEnCours ?? ($indexFiche === 'nouvelle' ? ['equipement' => 'panneaux', 'position' => '50% 50%', 'titre' => '', 'lieu' => '', 'commune' => '', 'detail' => '', 'alt' => '', 'provisoire' => false] : $liste[(int)$indexFiche]);
}
$n = count($liste);
$titrePage = !$connecte ? 'Connexion' : ($page === 'fiche' ? ($indexFiche === 'nouvelle' ? 'Nouvelle réalisation' : 'Modifier une réalisation') : 'Réalisations');
$optionsPosition = POSITIONS;
if ($fiche && !empty($fiche['position']) && !isset(POSITIONS[$fiche['position']])) $optionsPosition = [$fiche['position'] => 'Cadrage actuel'] + POSITIONS;
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title><?= h($titrePage) ?> · Administration Rap Énergies</title>
<meta name="theme-color" content="#14171c">
<link rel="icon" href="../images/symbole-64.png" type="image/png" sizes="64x64">
<link rel="stylesheet" href="admin.css">
</head>
<body>
<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="bandeau">
<div class="colonne bandeau-grille">
<a class="marque" href="./"><img src="../images/symbole-180.png" width="180" height="180" alt=""><span>Rap Énergies <b>Administration</b></span></a>
<nav class="nav" aria-label="Administration"><a href="../" target="_blank" rel="noopener">Voir le site</a><?php if ($connecte): ?><form method="post" action="./"><input type="hidden" name="action" value="deconnexion"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><button class="lien" type="submit">Se déconnecter</button></form><?php endif; ?></nav>
</div>
</header>
<main class="colonne" id="contenu">
<?php if ($flash): ?><p class="etat <?= h($flash[0]) ?>" role="status" aria-live="polite"><?= h($flash[1]) ?></p><?php endif; ?>

<?php if (!$connecte): ?>
<section class="carte connexion" aria-labelledby="t-connexion">
<h1 id="t-connexion">Connexion</h1>
<?php if (!$config): ?>
<p class="etat erreur">L'administration n'est pas encore configurée : le mot de passe n'a pas été installé sur le serveur.</p>
<?php else: ?>
<form method="post" action="./">
<input type="hidden" name="action" value="connexion"><input type="hidden" name="csrf" value="<?= h($csrf) ?>">
<p class="champ"><label for="mdp">Mot de passe</label><input id="mdp" type="password" name="mot_de_passe" autocomplete="current-password" required autofocus></p>
<p class="actions"><button class="bouton bouton-plein" type="submit">Entrer</button></p>
</form>
<?php endif; ?>
</section>

<?php elseif ($page === 'fiche' && $fiche !== null): ?>
<section aria-labelledby="t-fiche">
<p class="retour"><a href="./">← Retour aux réalisations</a></p>
<h1 id="t-fiche"><?= h($titrePage) ?></h1>
<form class="fiche" method="post" action="./" enctype="multipart/form-data" id="fiche">
<input type="hidden" name="action" value="enregistrer"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><input type="hidden" name="i" value="<?= h((string)$indexFiche) ?>"><input type="hidden" name="MAX_FILE_SIZE" value="<?= POIDS_MAX ?>">
<div class="fiche-photo">
<?php $v = !empty($fiche['fichier']) ? vignette((string)$fiche['fichier']) : ''; ?>
<div class="apercu" aria-hidden="true"><?php if ($v): ?><img id="apercu-img" src="<?= h($v) ?>" alt="" style="object-position:<?= h((string)($fiche['position'] ?? '50% 50%')) ?>"><?php else: ?><span>Aperçu de la photo</span><?php endif; ?></div>
<label class="depot"><span class="depot-titre"><?= $indexFiche === 'nouvelle' ? 'Choisir une photo' : 'Remplacer la photo' ?></span><input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" <?= $indexFiche === 'nouvelle' ? 'required' : '' ?>><span class="aide">Depuis l'appareil photo ou la galerie du téléphone. JPEG, PNG, WebP ou HEIC, 25 Mo au plus, 800 px de large au moins. La photo est redressée, ramenée à 1 800 px et débarrassée de ses métadonnées (position GPS comprise).<?= $indexFiche === 'nouvelle' ? '' : ' Laissez vide pour garder la photo actuelle.' ?></span></label>
<p class="aide regle">Pas de visage reconnaissable, pas de plaque d'immatriculation, pas d'adresse lisible : la commune suffit.</p>
</div>
<div class="fiche-champs">
<p class="champ"><label for="f-equipement">Équipement</label><select id="f-equipement" name="equipement"><?php foreach (EQUIPEMENTS as $k => $l): ?><option value="<?= h($k) ?>" <?= ($fiche['equipement'] ?? '') === $k ? 'selected' : '' ?>><?= h($l) ?></option><?php endforeach; ?></select></p>
<p class="champ"><label for="f-titre">Titre de la légende <span class="aide">(par défaut, le nom de l'équipement)</span></label><input id="f-titre" type="text" name="titre" value="<?= h((string)($fiche['titre'] ?? '')) ?>" placeholder="Panneaux photovoltaïques" maxlength="120"></p>
<div class="deux">
<p class="champ"><label for="f-lieu">Lieu ou type de toit</label><input id="f-lieu" type="text" name="lieu" value="<?= h((string)($fiche['lieu'] ?? '')) ?>" placeholder="toit en tuiles canal" maxlength="120" required></p>
<p class="champ"><label for="f-commune">Commune</label><input id="f-commune" type="text" name="commune" value="<?= h((string)($fiche['commune'] ?? '')) ?>" placeholder="Castries" maxlength="80" required list="communes"></p>
<datalist id="communes"><option value="Castries"><option value="Vendargues"><option value="Baillargues"><option value="Saint-Brès"><option value="Saint-Aunès"><option value="Le Crès"><option value="Jacou"><option value="Teyran"><option value="Clapiers"><option value="Assas"><option value="Guzargues"><option value="Saint-Drézéry"><option value="Sussargues"><option value="Beaulieu"><option value="Restinclières"><option value="Montaud"><option value="Montpellier"></datalist>
</div>
<p class="champ"><label for="f-detail">Détail utile <span class="aide">(une phrase : ce que ça remplace, la puissance, l'orientation…)</span></label><input id="f-detail" type="text" name="detail" value="<?= h((string)($fiche['detail'] ?? '')) ?>" placeholder="Remplace une chaudière au fioul." maxlength="200"></p>
<p class="champ"><label for="f-alt">Ce qu'on voit sur la photo <span class="aide">(lu par les lecteurs d'écran)</span></label><input id="f-alt" type="text" name="alt" value="<?= h((string)($fiche['alt'] ?? '')) ?>" placeholder="Panneaux photovoltaïques sur un toit de tuiles, ciel bleu" maxlength="200" required></p>
<div class="deux">
<p class="champ"><label for="f-position">Cadrage</label><select id="f-position" name="position"><?php foreach ($optionsPosition as $k => $l): ?><option value="<?= h($k) ?>" <?= ($fiche['position'] ?? '50% 50%') === $k ? 'selected' : '' ?>><?= h($l) ?></option><?php endforeach; ?></select></p>
<p class="champ case"><label><input type="checkbox" name="provisoire" value="1" <?= !empty($fiche['provisoire']) ? 'checked' : '' ?>> <span>Photo provisoire <span class="aide">(la galerie le dit, à décocher pour une vraie photo de chantier)</span></span></label></p>
</div>
<p class="actions"><button class="bouton bouton-plein" type="submit" id="envoyer" data-envoi="Enregistrement…">Enregistrer</button><a class="bouton bouton-trait" href="./">Annuler</a></p>
</div>
</form>
</section>

<?php else: ?>
<section aria-labelledby="t-liste">
<div class="tete">
<h1 id="t-liste">Réalisations <span class="compte"><?= $n ?></span></h1>
<p class="actions"><a class="bouton bouton-plein" href="./?page=fiche&amp;i=nouvelle">Ajouter une réalisation</a></p>
</div>
<p class="intro">L'ordre ci-dessous est celui de la galerie du site. Chaque enregistrement met le site à jour aussitôt.</p>
<?php if (!$liste): ?>
<p class="vide">Aucune réalisation pour l'instant. Ajoutez la première photo de chantier.</p>
<?php else: ?>
<ol class="liste">
<?php foreach ($liste as $i => $p): $f = (string)$p['fichier']; $v = vignette($f); ?>
<li class="realisation equipement-<?= h(isset(EQUIPEMENTS[$p['equipement'] ?? '']) ? (string)$p['equipement'] : 'panneaux') ?>">
<div class="photo"><?php if ($v): ?><img src="<?= h($v) ?>" alt="" loading="lazy" decoding="async" style="object-position:<?= h((string)($p['position'] ?? '50% 50%')) ?>"><?php else: ?><span>Photo manquante</span><?php endif; ?></div>
<div class="texte">
<p class="rang"><span class="repere" aria-hidden="true"></span><?= h(EQUIPEMENTS[$p['equipement'] ?? ''] ?? 'Panneaux photovoltaïques') ?> · n° <?= $i + 1 ?><?= !empty($p['provisoire']) ? ' <mark class="pl">photo provisoire</mark>' : '' ?></p>
<p class="legende"><?= h(legende($p)) ?></p>
<?php if (trim((string)($p['detail'] ?? '')) !== ''): ?><p class="detail"><?= h((string)$p['detail']) ?></p><?php endif; ?>
<div class="boutons">
<a class="bouton bouton-trait petit" href="./?page=fiche&amp;i=<?= $i ?>">Modifier</a>
<form method="post" action="./"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><input type="hidden" name="i" value="<?= $i ?>"><button class="bouton bouton-trait petit" type="submit" name="action" value="monter" <?= $i === 0 ? 'disabled' : '' ?> aria-label="Monter la réalisation n° <?= $i + 1 ?>">▲</button></form>
<form method="post" action="./"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><input type="hidden" name="i" value="<?= $i ?>"><button class="bouton bouton-trait petit" type="submit" name="action" value="descendre" <?= $i === $n - 1 ? 'disabled' : '' ?> aria-label="Descendre la réalisation n° <?= $i + 1 ?>">▼</button></form>
<form method="post" action="./" class="retirer" data-legende="<?= h(legende($p)) ?>"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><input type="hidden" name="i" value="<?= $i ?>"><button class="bouton lien-danger petit" type="submit" name="action" value="supprimer">Retirer</button></form>
</div>
</div>
</li>
<?php endforeach; ?>
</ol>
<?php endif; ?>
<details class="outils">
<summary>Si la galerie du site ne correspond plus à cette liste</summary>
<form method="post" action="./"><input type="hidden" name="action" value="regenerer"><input type="hidden" name="csrf" value="<?= h($csrf) ?>"><p class="actions"><button class="bouton bouton-trait" type="submit">Régénérer la galerie du site</button></p></form>
<p class="aide">Les photos retirées sont gardées dans la corbeille du serveur ; Mon Petit Site peut les remettre.</p>
</details>
</section>
<?php endif; ?>
</main>
<script>
(function () {
  'use strict';
  document.querySelectorAll('form.retirer').forEach(function (f) {
    f.addEventListener('submit', function (ev) { if (!window.confirm('Retirer cette réalisation du site ?\n« ' + f.dataset.legende + ' »')) ev.preventDefault(); });
  });
  var pos = document.getElementById('f-position'), img = document.getElementById('apercu-img');
  if (pos && img) pos.addEventListener('change', function () { img.style.objectPosition = pos.value; });
  var fiche = document.getElementById('fiche'), bouton = document.getElementById('envoyer');
  if (fiche && bouton) fiche.addEventListener('submit', function () { bouton.disabled = true; bouton.textContent = bouton.dataset.envoi; });
  var depot = document.querySelector('.depot input[type=file]');
  if (depot) depot.addEventListener('change', function () {
    var t = depot.closest('.depot').querySelector('.depot-titre');
    if (depot.files && depot.files[0]) t.textContent = depot.files[0].name;
  });
})();
</script>
</body>
</html>
