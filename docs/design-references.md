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

## Décision à prendre avant l'implémentation

Choisir une seule famille visuelle dominante pour la V2 :

- **Éditorial minimal :** typographie, photographie, espace et projets au premier plan.
- **Créatif cinématique :** narration, images fortes et mouvement discret mais expressif.
- **Studio numérique :** grille rigoureuse, détails techniques, interactions précises et ton professionnel.

Une fois la famille choisie, ce document devient la référence de cohérence du produit.
