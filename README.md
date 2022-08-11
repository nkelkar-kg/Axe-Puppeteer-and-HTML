# Axe-Puppeteer-and-HTML
This repo is an example of using Puppeteer to run accessibility checks on HTML code. The main script that is run is called `a11y-check.js`

Essentially, Puppeteer runs in headless mode, and the axe-core package code is injected into the "browser" as script. If axe finds any serious or critical issues, it will output the array of violations into the console.

`process.exit(1)` is used since if one wanted to add this script in a husky pre-push, any accessibility issues would prevent the developer from pushing their code to their remote repo.

Ensure that you run `yarn install` prior to running the `yarn a11y` command and that you have Node.js on your local machine
