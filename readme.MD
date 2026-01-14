# THIS HAS NOW BEEN DEPRECATED, THIS WAS THE OLD SITE

# OverviewEnergy.github.io

Official website for Overview Energy - making space part of Earth's energy infrastructure.

## Overview

This repository hosts our public-facing website at [overviewenergy.github.io](https://overviewenergy.github.io). The site is built with React, TypeScript, and Vite.

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **GitHub Pages** - Hosting
- **GitHub Actions** - Automated deployment

## Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch:

1. Push changes to `main`
2. GitHub Actions workflow runs automatically
3. Site builds via `npm run build`
4. Built files deploy to `gh-pages` branch
5. Changes go live at overviewenergy.github.io

### Deployment Workflow

The deployment is handled by `.github/workflows/deploy.yml`:
- Triggers on push to `main`
- Installs dependencies with `npm ci`
- Builds the site with `npm run build`
- Deploys the `dist` folder to the `gh-pages` branch
- GitHub Pages serves from the `gh-pages` branch

### Permissions

The workflow requires **Read and write permissions** for GitHub Actions, configured at the organization level:
- Organization Settings → Actions → General → Workflow permissions → "Read and write permissions"

## Project Structure
```
/
├── docs/           # Old source location (deprecated)
├── src/            # Application source code
├── public/         # Static assets
├── dist/           # Build output (generated, not committed)
└── .github/
    └── workflows/
        └── deploy.yml  # Deployment automation
```

## Contributing

1. Create a branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Push your branch and create a PR
5. Once merged to `main`, changes deploy automatically

## License

Proprietary - Overview Energy
