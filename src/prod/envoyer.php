<?php
// Formulaire de contact : reçoit le POST de la page d'accueil et l'envoie par e-mail à Rap Énergies avec mail() de
// PHP (sendmail de l'hébergeur Hostinger). Aucune donnée n'est enregistrée sur le serveur, aucun service tiers.
// Réponse : JSON si la page a envoyé en arrière-plan (en-tête Accept: application/json), sinon redirection vers merci.html.
declare(strict_types=1);

// Destinataire : le client. Un fichier config.php à côté (non versionné) peut le remplacer le temps des essais.
if (is_file(__DIR__ . '/config.php')) require __DIR__ . '/config.php';
if (!defined('DESTINATAIRE')) define('DESTINATAIRE', 'rapenergies@gmail.com');
// Expéditeur sur le domaine du site (couvert par le SPF de l'hébergeur) : site@<domaine>, déduit de l'adresse appelée.
define('EXPEDITEUR', 'site@' . (preg_replace('/^www\./', '', preg_replace('/[^a-z0-9.-]/i', '', $_SERVER['HTTP_HOST'] ?? '')) ?: 'rap-energies.fr'));
const NOM_SITE = 'Rap Énergies';
const PROJETS  = ['Panneaux solaires', 'Pompe à chaleur', 'Chauffe-eau thermodynamique', 'Je ne sais pas encore'];
const SECOURS  = "L'envoi n'a pas fonctionné. Appelez-nous au 06 99 34 66 86 ou écrivez à rapenergies@gmail.com.";
const MERCI    = "Merci, votre demande est bien partie. Nous vous rappelons au numéro indiqué. Si c'est urgent, appelez le 06 99 34 66 86.";

$json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
function repondre(int $code, bool $ok, string $message): never {
    global $json;
    if ($json) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: ' . ($ok ? 'merci.html' : './#contact'), true, 303);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ./#contact', true, 303); exit; }
if (!empty($_POST['site-web'])) repondre(200, true, MERCI);   // pot de miel rempli : un robot, on fait comme si c'était envoyé

$champ = fn(string $n, int $max) => mb_substr(trim(preg_replace('/[\r\n\t]+/', ' ', (string)($_POST[$n] ?? ''))), 0, $max);
$nom = $champ('nom', 80);
$tel = $champ('telephone', 30);
$email = $champ('email', 120);
$commune = $champ('commune', 80);
$message = mb_substr(trim((string)($_POST['message'] ?? '')), 0, 3000);
$projets = array_values(array_intersect(PROJETS, array_map('strval', (array)($_POST['projet'] ?? []))));

if (mb_strlen($nom) < 2) repondre(422, false, 'Indiquez votre nom.');
if (!preg_match('/^\+?[0-9 .()-]{9,30}$/', $tel) || preg_match_all('/[0-9]/', $tel) < 9) repondre(422, false, 'Indiquez un numéro de téléphone valide.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) repondre(422, false, "Indiquez une adresse e-mail valide, ou laissez le champ vide.");
if (mb_strlen($commune) < 2) repondre(422, false, 'Indiquez votre commune.');

$date = (new DateTime('now', new DateTimeZone('Europe/Paris')))->format('d/m/Y à H\hi');
$sujet = "Demande depuis le site : $nom, $commune";
$corps = "Nouvelle demande depuis le site " . NOM_SITE . ", le $date.\n\n"
       . "Nom : $nom\nTéléphone : $tel\nE-mail : " . ($email !== '' ? $email : 'non indiqué') . "\nCommune : $commune\n"
       . "Projet : " . ($projets ? implode(', ', $projets) : 'non précisé') . "\n\n"
       . "Message :\n" . ($message !== '' ? $message : '(aucun)') . "\n\n"
       . "Rappelez la personne au numéro indiqué. Cet e-mail est envoyé automatiquement par le site.\n";

if (getenv('FORMULAIRE_ESSAI')) {   // essais en local : on écrit dans un fichier au lieu d'envoyer
    file_put_contents(sys_get_temp_dir() . '/rap-formulaire-essai.txt', "Sujet : $sujet\n$corps\n----\n", FILE_APPEND);
    repondre(200, true, MERCI);
}

$entetes = [
    'From: ' . mb_encode_mimeheader(NOM_SITE, 'UTF-8') . ' <' . EXPEDITEUR . '>',
    'Reply-To: ' . ($email !== '' ? $email : EXPEDITEUR),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
];
$envoye = @mail(DESTINATAIRE, mb_encode_mimeheader($sujet, 'UTF-8'), $corps, implode("\r\n", $entetes), '-f' . EXPEDITEUR);
if (!$envoye) { error_log('Rap Énergies : échec de mail() pour une demande de contact'); repondre(500, false, SECOURS); }
repondre(200, true, MERCI);
