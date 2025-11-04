# Overview Website

## Overview of Tools

- CMS: [Craft CMS](https://craftcms.com/)
- Local Dev Server: [DDEV](https://ddev.readthedocs.io/en/stable/)
- Front-end dependency management: [Yarn](https://yarnpkg.com/)
- Front-end Build: [Gulp](https://gulpjs.com/)
- Styling: [Postcss](https://postcss.org/), [Tailwind](https://tailwindcss.com/)
- JavaScript: [jQuery](https://jquery.com/), [GSAP](https://gsap.com/docs), [Lottie](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/)


## Installation & Setup

1. Checkout repo 😉
2. [Install DDEV](https://ddev.readthedocs.io/en/stable/users/install/)
3. Install Gulp CLI globally via `npm install --global gulp-cli`
4. Install front-end dependencies via `yarn install`
5. Install PHP dependencies via `composer up`
6. Import copy of database from Staging or Production to DDEV database. DDEV provides multiple options for this, including `ddev import-db`, `ddev sequelace`, or `ddev sequelpro`. See the corresponding docs for whatever works with your process.
7. Get a copy of a teammate's local `.env` file and place in the root directory of the project (not checked in to repo as to not influence Staging/Production environments).
8. Run `ddev start` to create/start dev server and database. The server should now be accessible locally at http://overview.ddev.site

## Local Dev Workflow
1. Ensure DDEV server is running (see above).
2. Run `gulp` to start the default dev process and watcher. This process will do the following:
	- Proxy the DDEV url to http://localhost:3000 using [Browsersync](https://browsersync.io/). Updates to CSS, JS, and Twig templates will causes the browser to automatically reload changes.
	- CSS will be compilied whenever changes are made.
	- JS will be compiled whenever changes are made.

## Styling
The site uses Tailwind CSS classes within the Twig templates for the bulk of the styling needs. See the `tailwind.config.js` for the relevant project-specific config.

In addition to the provided Tailwind classes, some additional custom classes are compiled via the `main.postcss` entry file. Where possible, Tailwind's `@apply` function is used to keep things consistent.

For custom CSS "component" classes the "upper camel case" convention is used as follows:

- Parent component: `Tabs`
- Child of component: `Tabs-buttons`
- Variation/Extension of component: `Tabs--sliding`.

Additionally, where styling is tied to JavaScript functionality, data attribute selectors are used when relevant.

## Scripting

jQuery is included via CDN link (see `_scripts.twig`) and is used throughout custom scripts for selecting/manipulating page elements. For all other custom JS, the main entry point is `main.js`.

[Barba.js](https://barba.js.org/) is used to manage Ajax/pushstate page loads.

The bulk of the site's scripting is initialized via the `pageSections.js` module (which itself is initialized in `main.js`. This ensures that each page's sections have their corresponding scripts initialized in the expected order. The `data-init-section` data attribute is used within Page Section templates to indicate a script requirement. For example, see the `_fullWidthAccordion.twig` page section and note the inclusion of the `data-init-section="Accordion"` attribute, which causes `pageSections.js` to initialize `accordion.js` for the section.

## Craft Templates & "Page Sections"

For the most part, pages are composed in the CMS via a prepared suite of "Page Sections". To add a new page section, follow these steps:

1. Create a new "Entry Type" in Craft for the section with the desired fields (use existing fields or create new as needed).
2. Add the new "Entry Type" to the list of options within the "Page Sections" Matrix field configuration.
3. Create a new template for the section, at the following location `templates/sections/*_myNewSection.twig*".
4. The new template can now access its fields via the `section` variable like so: `{{ section.myField }}`. See existing Page Section templates for examples to copy/paste from.

The above works because "Pages" automatically use the "Page" entry type, which in turn uses the `_page.twig` template. Review that template to see how the Page Sections are included automatically. Also note that `_page.twig` assumes that each section has a `backgroundColor` field. Both `backgroundColor` and `sectionId` should be added to all new page section Entry Types in a "Config" tab. See existing sections for examples to follow.

## Deploying Updates
The site is currently deployed to [Servd](https://servd.host/) for both [Staging](https://overview-website.staging.servd.dev/) and Production (the latter coming soon). Automatic deploys are configured via `git push`.

Here are the steps to deploy updates:

1. Locally, run `gulp build` to generate minified front-end assets (JS & CSS). Commit the resulting assets to the Git repo.
2. Push the changes to either the remote `staging` or `production` branches. Pushing to either of these branches will cause Servd to automatically deploy the updates to the corresponding environment.
3. That's it!

Some notes about this system:

- Both Staging and Production use static HTML caching on Servd. This cache is configured to automatically break with every new deploy.
- Servd has the ability to run Node commands are part of the deploy process, which could potentially be used to automatically run `gulp build` in the future. For the time being, however, this is not configured and build output should be committed prior to deploying.
- Changes to Craft settings and configuration are generally NOT possible in Staging/Production, thanks to the `CRAFT_ALLOW_ADMIN_CHANGES=false` ENV variable. This requires admin changes to be made locally and deployed via the automatically generated config YAML files, which should not require any manual editing. These changes include field and entry type configurations.
- The Servd Assets plug-in is used both locally and in Staging/Prod to handle all assets. Within the Servd control panel you can copy assets between environments.
- In addition to Assets, the Servd control panel can copy databases between environments. Be VERY careful with this functionality and communicate with the team prior to any destructive database updates.