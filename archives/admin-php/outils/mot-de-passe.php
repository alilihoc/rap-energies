<?php
// Mot de passe de l'administration en ligne : écrit src/prod/admin-config.php (haché, bcrypt) et
// src/prod/admin-mot-de-passe.txt (en clair, pour l'envoyer au client et pour les essais), tous deux ignorés par git.
//   php outils/mot-de-passe.php                → mot de passe tiré au sort (14 caractères lisibles)
//   php outils/mot-de-passe.php "ma phrase"    → mot de passe donné (12 caractères au moins)
// Le déploiement (outils/deployer.sh) copie admin-config.php dans admin/config.php sur le serveur.
declare(strict_types=1);
$racine = dirname(__DIR__);
$mdp = $argv[1] ?? '';
if ($mdp === '') {
    $alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    for ($i = 0; $i < 14; $i++) $mdp .= $alphabet[random_int(0, strlen($alphabet) - 1)];
}
if (mb_strlen($mdp) < 12) { fwrite(STDERR, "Choisissez un mot de passe d'au moins 12 caractères.\n"); exit(1); }
$hache = password_hash($mdp, PASSWORD_DEFAULT);
$php = "<?php\n// Configuration de l'administration en ligne de rap-energies.fr, générée par outils/mot-de-passe.php le " . date('d/m/Y') . ".\n// Jamais versionné (voir .gitignore). Pour changer le mot de passe : relancer l'outil, puis redéployer.\nreturn ['mot_de_passe_hache' => " . var_export($hache, true) . "];\n";
file_put_contents("$racine/src/prod/admin-config.php", $php);
file_put_contents("$racine/src/prod/admin-mot-de-passe.txt", $mdp . "\n");
echo "Mot de passe : $mdp\nÉcrit : src/prod/admin-config.php (haché) et src/prod/admin-mot-de-passe.txt (clair).\n";
