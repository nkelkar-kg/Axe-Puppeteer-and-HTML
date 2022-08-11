/* eslint-disable no-console */
'use strict';

const puppeteer = require('puppeteer');
const axe = require('axe-core');
const path = require('path');

const a11yImportantIssues = {
	'serious': true,
	'critical': true
};

/**
 * @description Checks the acccesibility of an HTML file and logs any error results
 */
const checkAccessibility = async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		// Find the HTML file and open it via Puppeteer
		const filePath = path.join('file://', path.resolve('./sample.html'));
		await page.goto(filePath);

		// Inject the axe-core package to use in the headless browser
		await page.addScriptTag({ path: require.resolve('axe-core') });

		// Evaluate the axe check within the page's context
		const a11yIssues = await page.evaluate(async () => {
			const results = await axe.run(document);
			return results;
		});

		if (a11yIssues) {

			// If any nodes in incomplete array, it requires manual intervention to fix
			if (a11yIssues.incomplete && a11yIssues.incomplete.length) {
				console.error(a11yIssues.incomplete);
				process.exitCode = 1;
			}

			// Check for any high-priority accessibility violations only
			if (a11yIssues.violations) {
				for (const violation of a11yIssues.violations) {
					if (violation.impact && a11yImportantIssues[violation.impact]) {
						console.error(a11yIssues.violations.filter((vio) => a11yImportantIssues[vio.impact]));
						process.exitCode = 1;
					}
				}
			}
		}
		// If no issues, close the browser and return with no errors
		await browser.close();

	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

checkAccessibility();