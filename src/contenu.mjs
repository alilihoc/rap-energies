// Contenu du site Rap Énergies : les textes validés de recherche-et-textes.md § 5, repris tels quels.
// Les deux templates lisent ce fichier ; aucun texte n'est écrit ailleurs. Les crochets [À CONFIRMER],
// [À COMPLÉTER] et [À VÉRIFIER] restent visibles jusqu'à validation par le client.

export const marque = {
  nom: 'Rap Énergies',
  raison: 'RAP ENERGIES SAS',
  slogan: 'Panneaux solaires, pompe à chaleur et chauffe-eau thermodynamique à Castries',
};

export const coordonnees = {
  adresse: '570 avenue de la Royale',
  codePostal: '34160',
  ville: 'Castries',
  tel: '06 99 34 66 86',
  telHref: 'tel:+33699346686',
  email: 'rapenergies@gmail.com',
  site: 'https://rap-energies.fr/',
  geo: { lat: 43.6741, lon: 3.972 },
};

// court : libellé affiché sur mobile (une seule rangée d'ancres), quand il diffère.
export const navigation = [
  { libelle: 'Réalisations', court: 'Chantiers', href: '#realisations' },
  { libelle: 'Services', href: '#services' },
  { libelle: 'Comment ça se passe', court: 'Étapes', href: '#etapes' },
  { libelle: 'Communes', href: '#zone' },
  { libelle: 'Contact', href: '#contact' },
];

export const actions = {
  appeler: 'Appeler le 06 99 34 66 86',
  decrire: 'Décrire mon projet',
  envoyer: 'Envoyer ma demande',
};

export const accroche = {
  titre: 'Panneaux solaires, pompe à chaleur, chauffe-eau thermodynamique : posés par un électricien de Castries.',
  texte:
    "Rap Énergies installe chez vous les trois équipements qui font baisser la facture d'énergie d'une maison, à Castries et dans les villages de l'est de Montpellier. Électricien de métier, qualifié RGE par Qualifelec pour chacun des trois.",
  ligne: '570 avenue de la Royale, 34160 Castries · rapenergies@gmail.com',
  // Variante courte, proposée dans la recherche, non utilisée par défaut.
  titreVariante: 'Le soleil de Castries, installé chez vous.',
  texteVariante:
    "Panneaux solaires, pompe à chaleur et chauffe-eau thermodynamique, posés par un électricien d'ici, qualifié RGE Qualifelec pour les trois.",
};

// Galerie des réalisations. Les fiches (fichier, équipement, titre, lieu, commune, détail, texte alternatif,
// cadrage, provisoire) vivent dans src/realisations.json, tenu à jour par l'administration (admin/serveur.mjs).
// Les photos actuelles sont provisoires (Pexels, voir docs/images.md et template-N/images/A-REMPLACER.md).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ICI = dirname(fileURLToPath(import.meta.url));

export const realisations = {
  titre: 'Nos chantiers, à Castries et autour',
  texte:
    'Des toits équipés, des pompes à chaleur posées, des ballons remplacés dans les villages de la zone. Les photos sont prises sur nos chantiers [À CONFIRMER]. Cliquez sur une photo pour l\'agrandir.',
  // Mention affichée une seule fois sous l'introduction tant qu'au moins une photo de la galerie est provisoire.
  provisoire: 'Photos provisoires, à remplacer par des photos des chantiers de Rap Énergies.',
  photos: JSON.parse(readFileSync(join(ICI, 'realisations.json'), 'utf8')),
};
// Légende d'une réalisation : « Titre · lieu · commune », les parties vides omises.
export const legende = (p) => [p.titre, p.lieu, p.commune].filter(Boolean).join(' · ');

// Anciennes fiches, conservées pour mémoire du format d'origine ; la source de vérité est realisations.json.
const _anciennesFiches = {
  photos: [
    {
      fichier: 'pose-tuiles-canal',
      equipement: 'panneaux',
      legende: 'Panneaux photovoltaïques · toit en tuiles canal · [À COMPLÉTER : commune]',
      detail: 'Pose en cours, panneau présenté sur les tuiles.',
      alt: 'Mains gantées posant un panneau photovoltaïque sur un toit de tuiles canal',
      position: '50% 40%',
    },
    {
      fichier: 'toit-tuiles-pignon',
      equipement: 'panneaux',
      legende: 'Panneaux photovoltaïques · toit en tuiles · [À COMPLÉTER : commune]',
      detail: 'Pose en surimposition sur un pan de toit plein sud.',
      alt: 'Panneaux photovoltaïques sur un toit de tuiles rouges, ciel bleu',
      position: '50% 50%',
    },
    {
      fichier: 'toits-cheminees',
      equipement: 'panneaux',
      legende: 'Panneaux photovoltaïques · toits de tuiles et cheminées · [À COMPLÉTER : commune]',
      detail: 'Deux pans équipés, onduleur dans le garage.',
      alt: 'Panneaux photovoltaïques sur des toits de tuiles avec cheminées en brique',
      position: '50% 60%',
    },
    {
      fichier: 'toit-tuiles-sombres',
      equipement: 'panneaux',
      legende: 'Panneaux photovoltaïques · toit en tuiles · [À COMPLÉTER : commune]',
      detail: 'Panneaux posés au-dessus d\'une fenêtre de toit.',
      alt: 'Panneaux photovoltaïques sur un toit de tuiles sombres, fenêtre de toit en dessous',
      position: '45% 55%',
    },
    {
      fichier: 'pompe-a-chaleur-gravier',
      equipement: 'pompe-a-chaleur',
      legende: 'Pompe à chaleur air-eau · unité extérieure côté jardin · [À COMPLÉTER : commune]',
      detail: 'Remplace une chaudière au fioul.',
      alt: 'Unité extérieure de pompe à chaleur posée sur du gravier blanc près d\'arbustes',
      position: '50% 60%',
    },
    {
      fichier: 'pompe-a-chaleur-mur',
      equipement: 'pompe-a-chaleur',
      legende: 'Pompe à chaleur air-eau · unité extérieure sur plots · [À COMPLÉTER : commune]',
      detail: 'Remplace des convecteurs électriques.',
      alt: 'Unité extérieure de pompe à chaleur devant un mur de maison en pierre',
      position: '50% 65%',
    },
    {
      fichier: 'chauffe-eau-buanderie',
      equipement: 'chauffe-eau',
      legende: 'Chauffe-eau thermodynamique · buanderie · [À COMPLÉTER : commune]',
      detail: 'Remplace un cumulus électrique.',
      alt: 'Ballon d\'eau chaude mural dans une buanderie carrelée',
      position: '35% 40%',
    },
    {
      fichier: 'micro-onduleur-rail',
      equipement: 'panneaux',
      legende: 'Boîtier de raccordement et câblage sous les panneaux · toit · [À COMPLÉTER : commune]',
      detail: 'Câbles repris proprement jusqu\'au tableau.',
      alt: 'Boîtier électrique noir fixé sous les rails de panneaux solaires, câbles et visseuse posés sur un toit',
      position: '50% 50%',
    },
  ],
};

export const services = {
  titre: 'Trois équipements, un seul électricien',
  liste: [
    {
      id: 'panneaux',
      couleur: 'soleil',
      titre: 'Panneaux solaires photovoltaïques',
      court: 'Panneaux solaires',
      texte: [
        "Votre toit produit l'électricité que vous consommez dans la journée : électroménager, chauffe-eau, piscine, voiture électrique. Ce que vous ne consommez pas repart sur le réseau et vous est racheté, ou sert à chauffer votre eau.",
      ],
      // Puces raccourcies le 3 novembre 2026 après la critique (versions longues validées : recherche-et-textes.md § 5,
      // reprises dans QUESTIONS-CLIENT.md pour validation du raccourci).
      faisons: [
        'Étude de votre toit et de votre consommation',
        'Estimation PVGIS pour votre adresse',
        'Pose, onduleur, raccordement au tableau',
        'Démarches : mairie, Enedis, Consuel',
        'Mise en service et suivi de production',
      ],
      note: '[À CONFIRMER : quelles démarches Rap Énergies prend en charge]',
    },
    {
      id: 'pompe-a-chaleur',
      couleur: 'chaleur',
      titre: 'Pompe à chaleur (chauffage)',
      court: 'Pompe à chaleur',
      texte: [
        "Une pompe à chaleur prend les calories de l'air extérieur pour chauffer l'eau de vos radiateurs ou de votre plancher chauffant [À CONFIRMER : et l'eau chaude sanitaire]. Elle remplace une chaudière au fioul ou au gaz, ou des convecteurs électriques. Le climat de l'Hérault lui convient : l'air y est rarement très froid, et c'est là qu'une pompe à chaleur rend le mieux.",
      ],
      faisons: [
        'Visite et calcul de la puissance nécessaire',
        "Emplacement de l'unité extérieure : bruit, voisinage, accès",
        'Pose, raccordements, mise en service, réglages',
        'Explication du fonctionnement et de la programmation',
      ],
      note: '[À CONFIRMER : Rap Énergies pose-t-elle aussi des climatisations réversibles (pompe à chaleur air-air) ? Si oui, ajouter une phrase.]',
    },
    {
      id: 'chauffe-eau',
      couleur: 'eau',
      titre: 'Chauffe-eau thermodynamique',
      court: 'Chauffe-eau',
      texte: [
        "Un chauffe-eau thermodynamique, c'est un ballon d'eau chaude surmonté d'une petite pompe à chaleur. Il chauffe l'eau avec les calories de l'air du garage ou du cellier, au lieu d'une résistance électrique. Il remplace un cumulus classique, au même endroit.",
        "Couplé à des panneaux solaires, on le programme pour chauffer en milieu de journée, quand le toit produit : votre eau chaude est alors faite avec votre propre électricité.",
      ],
      faisons: [
        'Capacité choisie selon vos habitudes',
        "Dépose de l'ancien ballon, pose, raccordements",
        'Mise en service et programmation',
      ],
    },
  ],
  faisonsTitre: 'Ce que nous faisons :',
  ensemble: {
    titre: 'Les trois ensemble',
    texte:
      "Panneaux le jour, chauffe-eau à midi, pompe à chaleur l'hiver : les trois équipements se complètent, et il vaut mieux qu'ils soient pensés ensemble, par un électricien qui connaît votre tableau et votre compteur. Vous pouvez aussi commencer par un seul et ajouter les autres plus tard : nous prévoyons la place et les câbles.",
  },
};

export const production = {
  titre: "Ce qu'un toit produit ici",
  paragraphes: [
    "À Castries, d'après PVGIS, l'outil de la Commission européenne qui calcule la production solaire à partir de près de vingt ans de mesures satellite, 1 kWc de panneaux orientés au sud et inclinés à 30° produit environ 1 500 kWh par an. Une installation de 3 kWc, environ 4 500 kWh ; de 6 kWc, environ 9 000 kWh. En juillet, le mois le plus fort, on approche 170 kWh par kWc ; en décembre, encore 80.",
    "Ce sont des estimations, pour une toiture sans ombre. Votre toit a sa propre orientation, sa pente et ses masques, et c'est pour cela que nous venons le voir avant de chiffrer.",
  ],
  source: 'Source : PVGIS 5.3, Commission européenne, données SARAH3 2005-2023, pertes système 14 %. Estimation, pas un engagement de production.',
  sourceHref: 'https://re.jrc.ec.europa.eu/pvg_tools/fr/',
  legendeFigure: 'Production mensuelle estimée à Castries pour 1 kWc plein sud incliné à 30°, en kWh.',
  unite: 'kWh par kWc',
  // Le total annuel en grand au-dessus du graphique, et la définition de l'unité (ajoutés après la critique du 2 novembre 2026).
  totalTexte: 'par an pour 1 kWc plein sud, à Castries',
  glossaire: "kWc : kilowatt-crête, l'unité de puissance des panneaux solaires.",
  mois: [
    { nom: 'Janvier', court: 'janv.', kwh: 88 },
    { nom: 'Février', court: 'févr.', kwh: 100 },
    { nom: 'Mars', court: 'mars', kwh: 130 },
    { nom: 'Avril', court: 'avr.', kwh: 140 },
    { nom: 'Mai', court: 'mai', kwh: 155 },
    { nom: 'Juin', court: 'juin', kwh: 159 },
    { nom: 'Juillet', court: 'juil.', kwh: 169 },
    { nom: 'Août', court: 'août', kwh: 159 },
    { nom: 'Septembre', court: 'sept.', kwh: 135 },
    { nom: 'Octobre', court: 'oct.', kwh: 102 },
    { nom: 'Novembre', court: 'nov.', kwh: 83 },
    { nom: 'Décembre', court: 'déc.', kwh: 80 },
  ],
  total: 1500,
};

export const etapes = {
  titre: 'Comment ça se passe',
  liste: [
    { tete: 'Vous nous appelez, ou vous décrivez votre projet', suite: ' dans le formulaire. Nous vous rappelons pour convenir d\'une visite.' },
    { tete: 'Nous venons chez vous :', suite: ' toit, compteur, tableau électrique, chauffage et eau chaude actuels, dernières factures.' },
    { tete: 'Vous recevez un devis détaillé', suite: ", avec l'estimation de production PVGIS pour votre adresse quand il s'agit de panneaux. [À CONFIRMER : le devis est-il gratuit ? Si oui, l'écrire ici.]" },
    { tete: 'Nous nous occupons des démarches', suite: ' [À CONFIRMER : déclaration préalable en mairie, demande de raccordement Enedis, attestation Consuel, dossier d\'aides ; garder seulement ce que le client fait réellement].' },
    { tete: 'Nous posons, mettons en service et vous expliquons', suite: ' le fonctionnement. Le chantier est laissé propre.' },
    { tete: 'Après la pose, vous gardez notre numéro.', suite: ' [À CONFIRMER : entretien ou SAV proposé ?]' },
  ],
};

export const zone = {
  titre: 'Où nous intervenons',
  avant:
    "Rap Énergies est installée à Castries et intervient dans les communes voisines, à l'est de Montpellier, de la garrigue aux étangs :",
  communes: [
    'Castries', 'Vendargues', 'Baillargues', 'Saint-Brès', 'Saint-Aunès', 'Le Crès', 'Jacou', 'Teyran', 'Clapiers',
    'Assas', 'Guzargues', 'Saint-Drézéry', 'Sussargues', 'Beaulieu', 'Restinclières', 'Montaud', 'Montpellier',
  ],
  apres: "Votre commune n'est pas dans la liste ? Appelez quand même : à quelques kilomètres près, c'est souvent possible.",
  note: '[À CONFIRMER : liste définitive des communes]',
};

export const pourquoi = {
  titre: 'Pourquoi un électricien de Castries',
  points: [
    { tete: 'Électricien de métier.', texte: "Le photovoltaïque, la pompe à chaleur et le chauffe-eau thermodynamique sont d'abord des travaux électriques : tableau, protections, raccordement. C'est notre métier de base, pas une activité ajoutée." },
    { tete: 'Qualifié RGE par Qualifelec pour les trois équipements.', texte: "Panneaux solaires photovoltaïques, pompe à chaleur chauffage, chauffe-eau thermodynamique. La qualification est contrôlée et suivie chaque année ; c'est aussi la condition pour que vos travaux ouvrent droit aux aides publiques. [À COMPLÉTER : numéro de qualification, lien vers le certificat]" },
    { tete: 'À quelques minutes de chez vous.', texte: 'Pour la visite, pour la pose, et si vous avez besoin de nous après.' },
    { tete: 'Pas de démarchage.', texte: 'Nous ne faisons ni porte-à-porte ni appels : vous nous contactez quand vous êtes prêt. [À CONFIRMER]' },
    { tete: 'Des chiffres honnêtes.', texte: 'Les productions annoncées sont des estimations PVGIS pour votre adresse, pas des arguments de vente.' },
    { tete: 'Une seule entreprise, du devis à la mise en service.', texte: '[À CONFIRMER : aucune sous-traitance ?]' },
  ],
};

export const faq = {
  titre: 'Questions fréquentes',
  questions: [
    {
      q: 'Mon toit convient-il aux panneaux solaires ?',
      r: "Un toit orienté au sud, sans ombre portée, est l'idéal, mais un toit est-ouest produit aussi, réparti sur la journée. Ce qui compte : la surface disponible, la pente, l'état de la couverture et les ombres (arbres, cheminée, maison voisine). On le voit en une visite.",
    },
    {
      q: 'Faut-il une autorisation ?',
      r: "Oui, une déclaration préalable de travaux en mairie pour des panneaux en toiture. Dans certaines rues de Castries, aux abords du château ou de l'aqueduc, l'architecte des Bâtiments de France donne aussi son avis. [À CONFIRMER : Rap Énergies prépare-t-elle le dossier ?]",
    },
    {
      q: "Que devient l'électricité que je ne consomme pas ?",
      r: "Elle part sur le réseau et vous est rachetée dans le cadre d'un contrat d'obligation d'achat, ou elle est utilisée sur place : un chauffe-eau thermodynamique programmé à midi, par exemple. Les conditions de rachat changent régulièrement ; nous vous indiquons celles en vigueur au moment du devis.",
    },
    {
      q: 'Ai-je droit à des aides ?',
      r: "Les aides dépendent de l'équipement, de votre logement et de vos revenus, et les règles ont changé en 2026. Une chose ne change pas : elles exigent une entreprise qualifiée RGE, ce que nous sommes pour les trois équipements. Nous vous disons au devis celles qui s'appliquent à votre projet. [À CONFIRMER : accompagnement dans les dossiers ?]",
    },
    {
      q: 'Une pompe à chaleur chauffe-t-elle assez en hiver ?',
      r: "Dans l'Hérault, oui : l'air descend rarement sous zéro, et une pompe à chaleur rend d'autant mieux que l'air extérieur est doux. L'essentiel est de la dimensionner pour votre maison, ni trop petite ni trop grosse. C'est l'objet de la visite.",
    },
    {
      q: "Et l'entretien ?",
      r: "Des panneaux solaires demandent très peu d'entretien : la pluie les nettoie, et le suivi de production signale un défaut. Une pompe à chaleur doit être entretenue régulièrement ; un entretien tous les deux ans est obligatoire pour la plupart des pompes à chaleur de maison. [À CONFIRMER : Rap Énergies propose-t-elle l'entretien ?]",
    },
  ],
};

export const contact = {
  titre: 'Parlons de votre maison',
  texte: 'Appelez, ou décrivez votre projet en deux lignes : nous vous rappelons pour fixer une visite.',
  horaires: "[À COMPLÉTER : horaires d'appel, si le client en veut]",
  champs: {
    nom: 'Votre nom',
    tel: 'Téléphone',
    telAide: '10 chiffres, par exemple 06 12 34 56 78',
    email: 'E-mail (facultatif)',
    commune: 'Commune',
    projet: 'Votre projet',
    projetAide: 'Plusieurs choix possibles',
    message: 'Votre message (facultatif)',
    messageAide: 'Type de maison, chauffage actuel, ce que vous aimeriez changer…',
  },
  projets: ['Panneaux solaires', 'Pompe à chaleur', 'Chauffe-eau thermodynamique', 'Je ne sais pas encore'],
  consentement: 'Ces informations servent uniquement à vous rappeler. Voir la page Confidentialité.',
  envoiEnCours: 'Envoi en cours…',
  confirmation: "Merci, votre demande est bien partie. Nous vous rappelons au numéro indiqué. Si c'est urgent, appelez le 06 99 34 66 86.",
  erreur: "L'envoi n'a pas fonctionné. Appelez-nous au 06 99 34 66 86 ou écrivez à rapenergies@gmail.com.",
  // Message d'interface pour la voie provisoire sans point d'envoi : le formulaire ouvre la messagerie du visiteur.
  ouverture: "Votre messagerie s'ouvre avec le message prérempli : il ne reste qu'à l'envoyer. Si rien ne s'ouvre, écrivez à rapenergies@gmail.com ou appelez le 06 99 34 66 86.",
  sujetCourriel: 'Demande depuis rap-energies.fr',
};

export const pied = {
  ligne: 'RAP ENERGIES SAS · 570 avenue de la Royale, 34160 Castries · 06 99 34 66 86 · rapenergies@gmail.com',
  rge: 'Qualifiée RGE par Qualifelec : panneaux solaires photovoltaïques, pompe à chaleur chauffage, chauffe-eau thermodynamique.',
  liens: [
    { libelle: 'Mentions légales', href: 'mentions-legales.html' },
    { libelle: 'Confidentialité', href: 'confidentialite.html' },
  ],
  sources: "Sources : PVGIS (Commission européenne), Qualifelec, annuaire des entreprises (INSEE). Crédits photos : Rap Énergies [À COMPLÉTER si des photos provisoires sont utilisées].",
  realisation: { avant: 'Site réalisé par ', libelle: 'Mon Petit Site', href: 'https://mon-petit-site.fr/' },
};

export const legal = {
  mentions: {
    titre: 'Mentions légales',
    paragraphes: [
      "Éditeur du site : RAP ENERGIES, société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Montpellier sous le numéro 834 807 810, siège social 570 avenue de la Royale, 34160 Castries. Téléphone : 06 99 34 66 86. E-mail : rapenergies@gmail.com. Numéro de TVA intracommunautaire : FR36 834807810 [À VÉRIFIER].",
      'Président et directeur de la publication : Kevin Hainaut [À CONFIRMER, voir recherche § 1.2].',
      'Qualification : RGE Qualifelec (panneaux solaires photovoltaïques, pompe à chaleur chauffage, chauffe-eau thermodynamique) [À COMPLÉTER : numéro de qualification].',
      'Hébergeur : [À COMPLÉTER : même solution que maf-menuiserie.fr, raison sociale, adresse, téléphone].',
      'Réalisation : Mon Petit Site, mon-petit-site.fr.',
      "Photographies : Rap Énergies, sauf mention contraire. Tant que des photos provisoires sont en ligne, elles proviennent de Pexels (licence Pexels, usage libre, sans attribution obligatoire) ; la liste des fichiers, titres et auteurs figure dans la documentation du site et sera retirée avec les photos [À COMPLÉTER si photos provisoires : auteur, source, licence].",
      "Estimations de production : PVGIS, Commission européenne, Centre commun de recherche. Elles sont données à titre indicatif et ne constituent pas un engagement.",
      "Ce site n'utilise aucun cookie ni aucun outil de mesure d'audience.",
    ],
  },
  confidentialite: {
    titre: 'Confidentialité',
    blocs: [
      { tete: 'Quelles données', texte: "lorsque vous remplissez le formulaire, nous recevons votre nom, votre téléphone, votre commune, le type de projet, et, si vous les indiquez, votre e-mail et votre message." },
      { tete: 'Pourquoi', texte: "uniquement pour vous rappeler et préparer la visite. Elles ne servent à aucune prospection et ne sont transmises à personne." },
      { tete: 'Comment', texte: "le formulaire envoie un e-mail à rapenergies@gmail.com [À COMPLÉTER selon la solution d'envoi retenue : prestataire éventuel]." },
      { tete: 'Combien de temps', texte: '[À CONFIRMER : par exemple douze mois après le dernier échange, puis suppression].' },
      { tete: 'Vos droits', texte: "vous pouvez demander l'accès, la rectification ou la suppression de ces données en écrivant à rapenergies@gmail.com. Vous pouvez aussi saisir la CNIL." },
      { tete: 'Cookies', texte: "ce site ne dépose aucun cookie et n'utilise aucun traceur." },
    ],
  },
  retour: "Retour à l'accueil",
};

export const seo = {
  title: 'Panneaux solaires et pompes à chaleur à Castries | Rap Énergies',
  description:
    "Électricien à Castries, qualifié RGE Qualifelec : panneaux solaires photovoltaïques, pompe à chaleur et chauffe-eau thermodynamique, à Castries et à l'est de Montpellier.",
  canonical: 'https://rap-energies.fr/',
  titleMentions: 'Mentions légales | Rap Énergies',
  titleConfidentialite: 'Confidentialité | Rap Énergies',
};
