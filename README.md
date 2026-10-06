# Mathis Truong — Portfolio V2

Nouveau portfolio personnel de Mathis Truong, construit avec Next.js et déployé sur Vercel.

## État du projet

La V2 démarre volontairement sur une base technique propre. Le contenu, l'identité visuelle et les sections seront définis avant l'implémentation de l'interface.

L'ancienne version reste disponible dans la branche Git `archive/portfolio-v1`.

## Stack

- Next.js (App Router)
- React et TypeScript
- Tailwind CSS
- ESLint
- Vercel pour les prévisualisations et la production

## Développement local

Pré-requis : Node.js 20.9 ou plus récent.

```bash
npm ci
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Déploiement Vercel

1. Connecter le dépôt GitHub `FARONeye/portfolio` dans [Vercel](https://vercel.com/new).
2. Conserver **Root Directory** vide : le projet est déjà à la racine du dépôt.
3. Laisser Vercel détecter le framework **Next.js**.
4. Après le premier déploiement, ajouter `mathis-truong.com` dans **Settings → Domains** et appliquer les enregistrements DNS fournis par Vercel chez le registrar du domaine.

Chaque push sur `main` déclenchera ensuite un déploiement de production, et chaque branche ou pull request aura son aperçu dédié.

## Structure

```text
src/app/       Routes, layout et styles globaux
public/        Ressources statiques
```

## Direction artistique

La bibliothèque de références et les règles de conception de la V2 sont dans [docs/design-references.md](docs/design-references.md).
