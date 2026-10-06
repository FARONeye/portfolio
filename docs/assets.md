# Assets — Portfolio V2

Ce guide prépare les images de la V2 sans encore importer de photos personnelles.

## Direction d'image

Les photos doivent soutenir le portfolio, pas servir de décoration générique : portraits calmes et assumés, détails de travail, images de projets et textures éditoriales. Les images doivent rester cohérentes avec la direction visuelle qui sera choisie.

Nous privilégions :

- des photos personnelles issues de la photothèque de Mathis ;
- des captures et visuels dont Mathis possède les droits pour les projets ;
- si nécessaire, des images ou textures originales générées pour l'ambiance, jamais pour imiter une personne réelle ;
- pas de banques d'images génériques représentant artificiellement Mathis ou son parcours.

## Sélection à préparer dans Photos / iCloud

Créer un album privé nommé **Portfolio V2 — sélection** et y placer uniquement les candidats suivants :

| Besoin | Quantité | Cadrage conseillé |
| --- | ---: | --- |
| Portrait principal | 1 | Vertical, regard ou profil, fond simple, résolution élevée. |
| Portrait secondaire | 1–2 | Plus spontané ou en situation de travail, espace négatif disponible. |
| Détails personnels | 3–5 | Bureau, carnet, clavier, déplacement, voyage, texture ou objet qui raconte une facette réelle. |
| Projets | 2–4 par projet | Écrans, maquettes ou captures dont les droits sont maîtrisés. |
| Visuels d'ambiance | 2–4 | Optionnels ; création originale ou photo personnelle, sans texte intégré. |

Ne pas ajouter de photo contenant des tiers identifiables sans leur accord, ni de document, écran ou lieu qui révèle une information confidentielle.

## Organisation dans le dépôt

```text
public/media/
├── portraits/  # mathis-hero.webp, mathis-profile.webp
├── projects/   # nom-projet-cover.webp, nom-projet-detail-01.webp
└── editorial/  # texture-01.webp, travel-01.webp, workspace-01.webp
```

Les dossiers sont déjà prêts dans `public/media/`.

## Export et optimisation

Avant l'import :

1. Conserver les originaux dans Photos/iCloud ; le dépôt ne contient que des copies destinées au web.
2. Exporter sans données de localisation (EXIF/GPS), de préférence en JPEG haute qualité ou PNG si la transparence est nécessaire.
3. Préparer une version WebP ou AVIF optimisée avant la publication.
4. Viser 2400 px de large maximum pour une image pleine largeur, 1600 px pour une image standard et un poids inférieur à 500 Ko lorsque c'est raisonnable.
5. Donner un nom descriptif, en minuscules et avec des tirets.

## Accessibilité et contenu

Chaque image importée doit recevoir :

- un texte alternatif qui décrit l'information utile ;
- un crédit si elle n'est pas personnelle ;
- une indication de droit d'utilisation ;
- un rôle clair : portrait, projet, détail ou ambiance.

## Étape suivante

Quand l'album **Portfolio V2 — sélection** est prêt, sélectionner ensemble les images exactes à exporter. Elles seront copiées vers les dossiers ci-dessus, optimisées et référencées dans le site.
