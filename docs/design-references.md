# Design references — Portfolio V2

Ce document est le cadre de direction artistique de la V2. Il doit être consulté avant toute décision d'interface importante.

## Intention

Le portfolio doit paraître conçu, pas assemblé depuis un template. Nous empruntons des **principes** de composition, de rythme, de navigation et d'interaction aux références ci-dessous, sans reproduire une identité, un écran, une animation ou du contenu existant.

## Bibliothèque de références

| Référence | À étudier | À éviter |
| --- | --- | --- |
| [Godly](https://godly.design/sites/) | Direction artistique, interactions expressives, portfolios et sites créatifs. | Effets sans utilité ni lecture claire. |
| [Awwwards](https://www.awwwards.com/) | Narration immersive, transitions et mise en scène de projets. | Une page lente ou inaccessible au profit du spectacle. |
| [SiteInspire](https://www.siteinspire.com/) | Grilles éditoriales, typographie, portfolios minimalistes et hiérarchie. | Des mises en page trop convenues. |
| [Land-book](https://land-book.com/) | Héros, structure de page, CTA et lisibilité des pages complètes. | Les recettes marketing interchangeables. |
| [Lapa Ninja](https://www.lapa.ninja/) | Clarté d'une landing page, séquencement et présentation des projets. | Des sections répétitives de type SaaS. |
| [Minimal Gallery](https://minimal.gallery/) | Espace négatif, retenue, détail typographique et focalisation. | Le minimalisme qui retire l'information utile. |
| [Refs.Gallery](https://refs.gallery/collections) | Collections Portfolio, Storytelling, Typography, Motion, Interactive et 3D/WebGL. | Mélanger plusieurs styles contradictoires. |
| [Behance](https://www.behance.net/) | Études de cas, moodboards, image de marque et récit visuel d'un projet. | Utiliser une maquette de présentation comme interface finale. |
| [Dribbble](https://dribbble.com/) | Détails d'UI, composition d'une carte, états et micro-interactions. | Construire un flux complet à partir d'un seul "shot". |

## Règles de conception

1. **Une direction par écran.** Chaque page part d'un duo de références compatible, jamais d'un collage de tendances.
2. **Contenu avant effet.** Le nom, le rôle, les projets et le contact doivent être compris avant toute animation décorative.
3. **Hiérarchie éditoriale.** Titres courts, grands contrastes d'échelle, grilles nettes, marges généreuses et une seule action principale par bloc.
4. **Projets comme récits.** Une carte mène vers une étude : contexte, rôle, choix, visuels, résultat et liens utiles.
5. **Mouvement intentionnel.** Les animations signalent une navigation, une progression ou un changement d'état. Elles respectent `prefers-reduced-motion` et ne bloquent jamais la lecture.
6. **Mobile dès la conception.** Les compositions sont pensées pour petit écran, pas simplement compressées depuis le desktop.
7. **Performance comme contrainte esthétique.** Les médias sont optimisés ; la 3D ou les vidéos ne sont utilisées que lorsqu'elles renforcent vraiment le propos.
8. **Accessible par défaut.** Contrastes solides, navigation clavier, focus visible, texte sélectionnable, alternatives aux interactions au survol.
9. **Pas de copie.** On réinterprète les systèmes observés avec la marque, le contenu et les assets de Mathis Truong.

## Processus avant chaque section

1. Choisir la fonction : présenter, convaincre, raconter ou contacter.
2. Sélectionner deux références maximum dans la bibliothèque.
3. Identifier un principe précis à emprunter : grille, rythme, traitement image, transition ou navigation.
4. Définir le contenu réel avant de dessiner l'interface.
5. Vérifier desktop, mobile, clavier et mouvement réduit avant de conserver la direction.

## Filtres de recherche recommandés

- **Godly / Awwwards :** portfolio, personal, creative developer, interactive, typography.
- **SiteInspire / Minimal Gallery :** portfolio, minimal, typography, unusual layout, dark.
- **Land-book / Lapa Ninja :** portfolio, personal, creative, dark, big type.
- **Refs.Gallery :** Best Portfolio Websites, Storytelling Websites, Typography Website Design, Web Animation & Motion Design, 3D & WebGL Websites.
- **Behance / Dribbble :** personal branding, editorial portfolio, case study, creative developer.

## Direction retenue pour la première page

**Éditorial cinématique**, à partir de [SiteInspire](https://www.siteinspire.com/) et [Minimal Gallery](https://minimal.gallery/) pour la hiérarchie typographique, puis d’Awwwards pour la chorégraphie. Le portrait noir et blanc sert d'ancrage ; une seule couleur accentue les repères et les liens. La page réinterprète ces principes avec les photos personnelles de Mathis, sans reprendre une composition existante.

Les autres familles restent des pistes pour les futures pages, si les projets à présenter le justifient.

### Langage de mouvement de la page d'accueil

La structure éditoriale reste la base, avec un récit animé inspiré des collections [Storytelling](https://refs.gallery/collections/storytelling-websites) et [Web Animation & Motion Design](https://refs.gallery/collections/web-animation-motion-design) de Refs.Gallery.

Les mécanismes retenus sont précis :

- le traitement d’image, le scroll et la typographie contour observés dans [Kirschberg](https://www.awwwards.com/inspiration/image-effect-transition-scrolling-navigation-kirschberg) ;
- le passage grille → image immersive, la typographie au scroll et les micro-interactions documentés pour [Invisible North](https://www.awwwards.com/sites/invisible-north) ;
- le récit interactif dont les transitions relient réellement les scènes, comme dans [Bright Biotech](https://www.awwwards.com/inspiration/team-interactive-scrolling-story-bright-biotech) ;
- le mélange assumé du scroll vertical et horizontal, le `clip-path` et le `scroll-sync` relevés dans les présentations Awwwards.

La traduction propre au portfolio suit désormais ce parcours : le portrait quitte son cadre comme une photographie entière tandis que le décor se transforme en volets éditoriaux, le mot « REGARDER » se recompose lettre par lettre, puis trois images circulent dans un rail spatial où chaque verbe devient une matière typographique. Les plans se replient ensuite en un signe abstrait et ouvrent un losange noir vers la conclusion de l’introduction, avant les transitions horizontales par volets entre les trois chapitres. Le troisième acte devient la galerie de cinq projets : les cartes partent d’une pile, s’ouvrent dans un carrousel 3D et occupent successivement le premier plan avec profondeur, superposition, parallaxe interne et objets flottants, avant une conclusion plein écran. Chaque valeur est synchronisée en continu à la progression du scroll. `prefers-reduced-motion` retire les séquences longues et garde les informations accessibles.

### Palette et interaction projets

La base reste noire, grise et blanc cassé. L’améthyste est l’accent principal ; le bordeaux, le turquoise et une nuance coucher de soleil identifient les projets et éclairent ponctuellement les scènes. L’environnement évoque l’espace, les interfaces high-tech et le rythme des jeux d’aventure sans reprendre les codes littéraux d’un HUD de jeu.

La section 03 s’annonce explicitement comme une galerie de projets. Le scroll choisit la carte active ; son bouton « Voir le projet » ouvre une fiche immersive native, utilisable à la souris, au clavier et avec `Échap`. Sur mobile et en mouvement réduit, toutes les cartes restent directement accessibles sans dépendre du carrousel.

### Acte 02 — carnet de voyages d’études

Le deuxième acte raconte désormais cinq étapes académiques : France (Paris et Lyon), Dublin, Barcelone, Montréal et Boston. La métaphore n’est pas décorative : la progression du scroll dessine l’itinéraire, déplace un avion entre les codes de destination, tourne les scènes comme des pages de passeport et fait apparaître chaque photo comme une carte postale tamponnée. Une carte d’embarquement rassemble le pays, la ville et le sens de l’étape sans inventer d’établissement ni de date. Sur mobile, la route devient un carnet vertical lisible et chaque escale reste une section autonome.

L’expérience desktop adopte ensuite un point de vue de vol : chaque paysage occupe l’espace entier, la destination suivante apparaît dans la profondeur de l’horizon, puis s’ouvre jusqu’à remplacer la scène précédente. L’inclinaison, les lignes de vitesse, les anneaux d’approche et la silhouette abstraite de l’appareil réagissent au scroll pour produire une sensation de déplacement sans sacrifier la carte d’information. Le carnet vertical reste volontairement plus calme sur mobile.

## Familles explorées

Choisir une seule famille visuelle dominante pour la V2 :

- **Éditorial minimal :** typographie, photographie, espace et projets au premier plan.
- **Créatif cinématique :** narration, images fortes et mouvement discret mais expressif.
- **Studio numérique :** grille rigoureuse, détails techniques, interactions précises et ton professionnel.

Une fois la famille choisie, ce document devient la référence de cohérence du produit.
