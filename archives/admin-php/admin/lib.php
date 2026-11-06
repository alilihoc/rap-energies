<?php
// Bibliothèque de l'administration des réalisations de Rap Énergies, pour l'hébergement PHP (Hostinger).
// Pas de base de données : les fiches sont dans admin/realisations.json, les photos envoyées dans admin/sources/
// (JPEG 1 800 px, sans métadonnées), les dérivés dans images/ (AVIF, WebP, JPEG en quatre largeurs), et la section
// « Nos chantiers » de index.html est réécrite entre deux repères à chaque enregistrement, avec le même balisage que
// src/commun/composants.mjs (galerie()). Le même JSON et les mêmes sources sont rapatriés en local par
// outils/recuperer.sh avant chaque déploiement, pour que rien ne se perde.
declare(strict_types=1);

const ADMIN_DIR = __DIR__;
const SITE_DIR = __DIR__ . '/..';
const FICHIER_DONNEES = ADMIN_DIR . '/realisations.json';
const FICHIER_GABARIT = ADMIN_DIR . '/gabarit.json';
const FICHIER_CONFIG = ADMIN_DIR . '/config.php';
const FICHIER_ESSAIS = ADMIN_DIR . '/tentatives.json';
const DOSSIER_SOURCES = ADMIN_DIR . '/sources';
const DOSSIER_CORBEILLE = ADMIN_DIR . '/corbeille';
const DOSSIER_IMAGES = SITE_DIR . '/images';
const PAGE_INDEX = SITE_DIR . '/index.html';
const LARGEURS = [480, 800, 1200, 1800];
const LARGEUR_SOURCE = 1800;           // plus grand côté horizontal de la photo conservée
const HAUTEUR_SOURCE = 2700;
const LARGEUR_MIN = 800;               // en dessous, la photo est trop petite pour la galerie
const POIDS_MAX = 25 * 1024 * 1024;
const PIXELS_MAX = 60_000_000;
const EQUIPEMENTS = ['panneaux' => 'Panneaux photovoltaïques', 'pompe-a-chaleur' => 'Pompe à chaleur air-eau', 'chauffe-eau' => 'Chauffe-eau thermodynamique'];
const POSITIONS = ['50% 50%' => 'Centre', '50% 30%' => 'Vers le haut', '50% 70%' => 'Vers le bas', '30% 50%' => 'Vers la gauche', '70% 50%' => 'Vers la droite'];
const REPERE_DEBUT = '<!-- realisations:debut -->';
const REPERE_FIN = '<!-- realisations:fin -->';

// Même échappement que outils/typo.mjs (esc) : & < > " ; l'apostrophe reste telle quelle (attributs entre guillemets doubles).
function h(string $s): string { return htmlspecialchars($s, ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8'); }

/* ---------- Typographie française, même règles que outils/typo.mjs ---------- */
function fr(string $texte): string {
    $fine = "\u{202F}"; $insec = "\u{00A0}";
    $r = [
        '/ ([;!?])/u' => $fine . '$1',
        '/ :/u' => $insec . ':',
        '/« /u' => '«' . $insec,
        '/ »/u' => $insec . '»',
        '/(\d{2}) (\d{2}) (\d{2}) (\d{2}) (\d{2})/u' => '$1' . $insec . '$2' . $insec . '$3' . $insec . '$4' . $insec . '$5',
        '/(\d) (\d{3})\b/u' => '$1' . $insec . '$2',
        '/(\d) (kWh|kWc|km|€|%|px|h|m²|ans|personnes)/u' => '$1' . $insec . '$2',
        '/(\d) °/u' => '$1' . $insec . '°',
        '/n° /u' => 'n°' . $insec,
        '/(\d{1,2}) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/u' => '$1' . $insec . '$2',
    ];
    return (string)preg_replace(array_keys($r), array_values($r), $texte);
}
function marques(string $html): string {
    return (string)preg_replace_callback('/\[À (CONFIRMER|COMPLÉTER|VÉRIFIER)([^\]]*)\]/u', function ($m) {
        return '<mark class="pl" title="À ' . mb_strtolower($m[1]) . ' avec le client">[À ' . $m[1] . $m[2] . ']</mark>';
    }, $html);
}
function t(string $texte): string { return marques(h(fr($texte))); }
function legende(array $p): string { return implode(' · ', array_values(array_filter([$p['titre'] ?? '', $p['lieu'] ?? '', $p['commune'] ?? ''], fn($x) => trim((string)$x) !== ''))); }

/* ---------- Identifiants de fichiers ---------- */
function slug(string $texte): string {
    $s = str_replace(['æ', 'œ', 'Æ', 'Œ'], ['ae', 'oe', 'ae', 'oe'], $texte);
    $t = function_exists('transliterator_transliterate') ? transliterator_transliterate('Any-Latin; Latin-ASCII', $s) : @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    if (!is_string($t)) $t = $s;
    $t = strtolower($t);
    $t = (string)preg_replace('/[^a-z0-9]+/', '-', $t);
    $t = trim($t, '-');
    return $t !== '' ? substr($t, 0, 60) : 'photo';
}
function slug_unique(string $base, array $liste, ?string $actuel): string {
    $s = $base; $n = 2;
    $pris = fn(string $c) => $c !== $actuel && (in_array($c, array_column($liste, 'fichier'), true) || is_file(DOSSIER_SOURCES . "/$c.jpg") || glob(DOSSIER_IMAGES . "/$c-*.jpg"));
    while ($pris($s)) $s = $base . '-' . $n++;
    return $s;
}
/** Nom de fichier neuf à chaque photo envoyée : les images sont servies avec un cache d'un an (navigateurs et CDN),
 *  une photo ajoutée ou remplacée doit donc toujours avoir une adresse qui n'a jamais servi. */
function nouveau_fichier(array $p, array $liste): string {
    $base = substr(slug(($p['titre'] ?? '') . '-' . ($p['lieu'] ?? '') . '-' . ($p['commune'] ?? '')), 0, 56);
    return slug_unique(rtrim($base, '-') . '-' . bin2hex(random_bytes(3)), $liste, null);
}
function fichier_valide(string $f): bool { return (bool)preg_match('/^[a-z0-9][a-z0-9-]{0,70}$/', $f); }

/* ---------- Données ---------- */
function charger(): array {
    if (!is_file(FICHIER_DONNEES)) return [];
    $d = json_decode((string)file_get_contents(FICHIER_DONNEES), true);
    if (!is_array($d)) return [];
    return array_values(array_filter($d, fn($p) => is_array($p) && !empty($p['fichier']) && fichier_valide((string)$p['fichier'])));
}
/** Écriture atomique sous verrou ; $modifier reçoit la liste et la renvoie modifiée. */
function modifier(callable $modifier): array {
    $verrou = fopen(ADMIN_DIR . '/realisations.lock', 'c');
    if (!$verrou || !flock($verrou, LOCK_EX)) throw new RuntimeException('Impossible de verrouiller les données.');
    try {
        $liste = $modifier(charger());
        $json = json_encode(array_values($liste), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) throw new RuntimeException('Données illisibles.');
        $tmp = FICHIER_DONNEES . '.' . bin2hex(random_bytes(4)) . '.tmp';
        if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false || !rename($tmp, FICHIER_DONNEES)) { @unlink($tmp); throw new RuntimeException("Impossible d'enregistrer les données."); }
        return array_values($liste);
    } finally { flock($verrou, LOCK_UN); fclose($verrou); }
}
function gabarit(): array {
    $g = is_file(FICHIER_GABARIT) ? json_decode((string)file_get_contents(FICHIER_GABARIT), true) : null;
    return is_array($g) ? $g : ['titre' => 'Nos chantiers, à Castries et autour', 'texte' => '', 'provisoire' => '', 'sizes' => '100vw', 'mosaique' => true];
}
function charger_config(): ?array {
    if (!is_file(FICHIER_CONFIG)) return null;
    $c = include FICHIER_CONFIG;
    return is_array($c) && !empty($c['mot_de_passe_hache']) ? $c : null;
}

/* ---------- Dérivés présents dans images/ ---------- */
function derives(string $f): array {
    $out = ['avif' => [], 'webp' => [], 'jpg' => []];
    if (!fichier_valide($f)) return $out;
    foreach (LARGEURS as $w) foreach (['avif', 'webp', 'jpg'] as $ext) if (is_file(DOSSIER_IMAGES . "/$f-$w.$ext")) $out[$ext][] = $w;
    return $out;
}
/** [largeur, hauteur] du plus grand JPEG présent, ou null. */
function dims(string $f): ?array {
    $d = derives($f);
    if (!$d['jpg']) return null;
    $w = max($d['jpg']);
    $i = @getimagesize(DOSSIER_IMAGES . "/$f-$w.jpg");
    return $i ? [$i[0], $i[1]] : null;
}
function vignette(string $f): string {
    $d = derives($f);
    if ($d['webp']) return '../images/' . $f . '-' . min($d['webp']) . '.webp';
    if ($d['jpg']) return '../images/' . $f . '-' . min($d['jpg']) . '.jpg';
    return '';
}

/* ---------- HTML de la galerie, même balisage que composants.mjs ---------- */
function portees(int $n): array {
    $out = []; $rangeeDeDeux = true;
    while (count($out) < $n) {
        $reste = $n - count($out);
        if ($reste === 1) $out[] = 6;
        elseif ($reste === 2) array_push($out, 3, 3);
        elseif ($rangeeDeDeux) array_push($out, 3, 3);
        else array_push($out, 2, 2, 2);
        $rangeeDeDeux = !$rangeeDeDeux;
    }
    return array_slice($out, 0, $n);
}
function html_picture(array $p, string $sizes): string {
    $f = (string)$p['fichier'];
    $d = derives($f); $dim = dims($f);
    if (!$dim || !$d['jpg']) return '';
    // Même <img> que composants.mjs : le JPEG de 1 200 px (ou le plus grand disponible) avec ses dimensions réelles.
    $wImg = in_array(1200, $d['jpg'], true) ? 1200 : max($d['jpg']);
    $i = @getimagesize(DOSSIER_IMAGES . "/$f-$wImg.jpg");
    [$w0, $h0] = $i ? [$i[0], $i[1]] : $dim;
    $srcset = fn(string $ext) => implode(', ', array_map(fn($w) => "images/$f-$w.$ext {$w}w", $d[$ext]));
    $style = !empty($p['position']) ? ' style="object-position:' . h((string)$p['position']) . '"' : '';
    $html = "<picture>\n";
    if ($d['avif']) $html .= '<source type="image/avif" srcset="' . h($srcset('avif')) . '" sizes="' . h($sizes) . "\">\n";
    if ($d['webp']) $html .= '<source type="image/webp" srcset="' . h($srcset('webp')) . '" sizes="' . h($sizes) . "\">\n";
    $html .= '<img src="images/' . $f . '-' . $wImg . '.jpg" width="' . $w0 . '" height="' . $h0 . '" alt="' . h((string)($p['alt'] ?? '')) . '" loading="lazy" decoding="async"' . $style . ">\n</picture>";
    return $html;
}
function html_section(array $photos): string {
    $g = gabarit();
    $sizes = (string)($g['sizes'] ?? '100vw');
    $spans = !empty($g['mosaique']) ? portees(count($photos)) : [];
    $items = [];
    foreach (array_values($photos) as $i => $p) {
        $f = (string)$p['fichier'];
        $d = derives($f);
        if (!$d['jpg']) continue;
        $leg = legende($p);
        $legendeNue = trim((string)preg_replace('/\s*·?\s*\[À [^\]]*\]/u', '', $leg));
        $classe = $spans && $spans[$i] === 6 ? ' large' : '';
        $style = $spans ? ' style="--c:' . $spans[$i] . '"' : '';
        $equip = isset(EQUIPEMENTS[$p['equipement'] ?? '']) ? (string)$p['equipement'] : 'panneaux';
        $detail = trim((string)($p['detail'] ?? ''));
        $items[] = '<li class="galerie-item' . $classe . '" data-equipement="' . $equip . '"' . $style . ">\n<figure>\n"
            . '<a class="photo-lien" href="images/' . $f . '-' . max($d['jpg']) . '.jpg" data-legende="' . h(fr($legendeNue)) . '" data-index="' . $i . "\">\n"
            . html_picture($p, $sizes) . "\n</a>\n"
            . '<figcaption><span class="repere repere-' . $equip . '" aria-hidden="true"></span><span class="legende">' . t($leg) . '</span>' . ($detail !== '' ? '<span class="detail">' . t($detail) . '</span>' : '') . "</figcaption>\n</figure>\n</li>";
    }
    $provisoire = array_filter($photos, fn($p) => !empty($p['provisoire'])) && !empty($g['provisoire']) ? "\n" . '<p class="note galerie-note">' . t((string)$g['provisoire']) . '</p>' : '';
    return '<section class="realisations" id="realisations" aria-labelledby="t-realisations">' . "\n"
        . '<div class="colonne realisations-tete">' . "\n"
        . '<h2 id="t-realisations">' . t((string)$g['titre']) . "</h2>\n"
        . '<p class="intro">' . t((string)$g['texte']) . '</p>' . $provisoire . "\n</div>\n"
        . '<ul class="galerie colonne">' . "\n" . implode("\n", $items) . "\n</ul>\n</section>";
}
/** Réécrit la section « Nos chantiers » de index.html entre ses repères, et le total du compteur de la visionneuse. */
function reecrire_index(array $photos): void {
    $html = @file_get_contents(PAGE_INDEX);
    if ($html === false) throw new RuntimeException('index.html introuvable.');
    $a = strpos($html, REPERE_DEBUT); $b = strpos($html, REPERE_FIN);
    if ($a === false || $b === false || $b < $a) throw new RuntimeException('Repères de la galerie absents de index.html : reconstruire le site (outils/build.mjs) puis redéployer.');
    $visibles = array_values(array_filter($photos, fn($p) => derives((string)$p['fichier'])['jpg']));
    $neuf = substr($html, 0, $a) . REPERE_DEBUT . "\n" . html_section($visibles) . "\n" . substr($html, $b);
    $neuf = (string)preg_replace('/(<p class="visionneuse-compteur"><span class="num">1<\/span> \/ )\d+/', '${1}' . count($visibles), $neuf, 1);
    $tmp = PAGE_INDEX . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $neuf, LOCK_EX) === false || !rename($tmp, PAGE_INDEX)) { @unlink($tmp); throw new RuntimeException("Impossible d'écrire index.html."); }
}

/* ---------- Images (GD, Imagick en secours pour le HEIC) ---------- */
function lire_image(string $chemin): array {
    if (!is_file($chemin)) throw new InvalidArgumentException("La photo n'a pas été reçue.");
    if (filesize($chemin) > POIDS_MAX) throw new InvalidArgumentException('Cette photo est trop lourde (25 Mo au plus).');
    $info = @getimagesize($chemin);
    if (!$info && class_exists('Imagick')) {
        // HEIC d'iPhone ou autre format que GD ne lit pas : conversion en JPEG par Imagick quand il sait le faire.
        try {
            $im = new Imagick($chemin); $im->setImageFormat('jpeg'); $im->setImageCompressionQuality(92);
            $tmp = tempnam(sys_get_temp_dir(), 'rap-'); $im->writeImage($tmp); $im->clear();
            if (@getimagesize($tmp)) { $chemin = $tmp; $info = getimagesize($chemin); }
        } catch (Throwable $e) { /* on dira que le format n'est pas lisible */ }
    }
    if (!$info) throw new InvalidArgumentException("Ce fichier n'est pas une photo lisible : envoyez un JPEG, un PNG ou un WebP.");
    [$w0, $h0, $type] = $info;
    if (!in_array($type, [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) throw new InvalidArgumentException("Ce format n'est pas accepté : envoyez un JPEG, un PNG ou un WebP.");
    if ($w0 * $h0 > PIXELS_MAX) throw new InvalidArgumentException('Cette photo est trop grande en pixels, essayez-en une autre.');
    $img = match ($type) { IMAGETYPE_JPEG => @imagecreatefromjpeg($chemin), IMAGETYPE_PNG => @imagecreatefrompng($chemin), default => @imagecreatefromwebp($chemin) };
    if (!$img) throw new InvalidArgumentException("Cette photo n'a pas pu être lue, essayez-en une autre.");
    if ($type === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($chemin);
        $o = (int)($exif['Orientation'] ?? 1);
        if (in_array($o, [2, 4, 5, 7], true)) imageflip($img, IMG_FLIP_HORIZONTAL);
        $angle = match ($o) { 3, 4 => 180, 6, 5 => -90, 8, 7 => 90, default => 0 };
        if ($angle) { $r = imagerotate($img, $angle, 0); if ($r) { imagedestroy($img); $img = $r; } }
    }
    return [$img, $w0, $h0];
}
function reduire(GdImage $src, int $largeur): GdImage {
    $w = imagesx($src); $h = imagesy($src);
    $nw = max(1, $largeur); $nh = max(1, (int)round($h * $largeur / $w));
    $dst = imagecreatetruecolor($nw, $nh);
    imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    return $dst;
}
/** Enregistre la source (JPEG 1 800 px sans métadonnées) et ses dérivés. Renvoie [largeur, hauteur] de la source. */
function traiter_image(string $chemin, string $nom): array {
    if (!fichier_valide($nom)) throw new RuntimeException('Nom de fichier invalide.');
    [$img] = lire_image($chemin);
    $w = imagesx($img); $h = imagesy($img);
    if ($w < LARGEUR_MIN) { imagedestroy($img); throw new InvalidArgumentException("Cette photo est trop petite ($w px de large) : il en faut une d'au moins " . LARGEUR_MIN . ' px.'); }
    $k = min(1.0, LARGEUR_SOURCE / $w, HAUTEUR_SOURCE / $h);
    $source = $k < 1 ? reduire($img, (int)round($w * $k)) : $img;
    if ($source !== $img) imagedestroy($img);
    if (!is_dir(DOSSIER_SOURCES)) mkdir(DOSSIER_SOURCES, 0755, true);
    if (!is_dir(DOSSIER_IMAGES)) mkdir(DOSSIER_IMAGES, 0755, true);
    if (!imagejpeg($source, DOSSIER_SOURCES . "/$nom.jpg", 86)) { imagedestroy($source); throw new RuntimeException("Impossible d'enregistrer la photo."); }
    $ws = imagesx($source); $hs = imagesy($source);
    supprimer_derives($nom);
    foreach (LARGEURS as $lg) {
        if ($lg > $ws && $lg !== 1200) continue;          // la largeur 1200 est toujours produite (à la taille réelle si la source est plus petite) : c'est le JPEG de secours
        $d = $lg >= $ws ? $source : reduire($source, $lg);
        if (function_exists('imageavif')) @imageavif($d, DOSSIER_IMAGES . "/$nom-$lg.avif", 56, 7);
        imagewebp($d, DOSSIER_IMAGES . "/$nom-$lg.webp", 78);
        if ($lg === 1200 || $lg === 1800) imagejpeg($d, DOSSIER_IMAGES . "/$nom-$lg.jpg", 80);
        if ($d !== $source) imagedestroy($d);
    }
    imagedestroy($source);
    return [$ws, $hs];
}
function supprimer_derives(string $nom): void {
    if (!fichier_valide($nom)) return;
    foreach (glob(DOSSIER_IMAGES . "/$nom-*.{avif,webp,jpg}", GLOB_BRACE) ?: [] as $f) if (preg_match('/-(480|800|1200|1800)\.(avif|webp|jpg)$/', $f)) @unlink($f);
}
function mettre_a_la_corbeille(string $nom): void {
    $src = DOSSIER_SOURCES . "/$nom.jpg";
    if (!fichier_valide($nom) || !is_file($src)) return;
    if (!is_dir(DOSSIER_CORBEILLE)) mkdir(DOSSIER_CORBEILLE, 0755, true);
    @rename($src, DOSSIER_CORBEILLE . "/$nom-" . date('Ymd-His') . '.jpg');
}
