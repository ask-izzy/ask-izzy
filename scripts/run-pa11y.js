/* @flow */
import pa11y from "pa11y";
import path from "path";
import ansiEscapes from "ansi-escapes";
import fs from "fs-extra";

const previousIssuesJsonPath = path.join(
    __dirname,
    "./previous-accessibility-issues.json"
);

// Self executing func so await can be used
(async() => {
    try {
        await checkForIssues(process.argv.includes("--ignore-existing-issues"));
    } catch (error) {
        if (error.message !== "") {
            console.error(error);
        }
        process.exit(1);
    }
})();

// eslint-disable-next-line complexity
async function checkForIssues(ignoreExistingIssues) {
    let previousIssues, continuingIssues, resolvedIssues;
    const newIssues = {};

    if (ignoreExistingIssues) {
        if (await fs.pathExists(previousIssuesJsonPath)) {
            previousIssues = await fs.readJson(previousIssuesJsonPath);
            continuingIssues = {};
            resolvedIssues = {};
        }
    }

    for await (const { results, path } of checkNextPage()) {
        if (!Array.isArray(results.issues)) {
            console.error("Testing failed for unknown reason");
            return;
        }
        const {
            newIssues: currentPageNewIssues,
            continuingIssues: currentPageContinuingIssues,
            resolvedIssues: currentPageResolvedIssues,
        } = findContinuingIssues(
            results.issues,
            previousIssues?.[path] || []
        );

        newIssues[path] = currentPageNewIssues;
        if (continuingIssues) {
            continuingIssues[path] = currentPageContinuingIssues;
        }
        if (resolvedIssues) {
            resolvedIssues[path] = currentPageResolvedIssues;
        }

        const numOfCurrentPageNewErrors = currentPageNewIssues.filter(
            (issue) => issue?.type !== "warning"
        ).length;

        if (currentPageNewIssues.length > 0) {
            process.stdout.write("\n");
            console.error(
                `${currentPageNewIssues.length} ` +
                    `${
                        previousIssues ? "new " : ""
                    }issue(s) found with ${path}`
            );
            console.error(currentPageNewIssues);
            if (
                numOfCurrentPageNewErrors > 0 &&
                (process.env.CI || process.env.FAIL_FAST)
            ) {
                throw new Error();
            }
        }
    }

    let newPreviousIssues = continuingIssues || newIssues;
    await fs.writeJson(previousIssuesJsonPath, newPreviousIssues, {
        spaces: 2,
    });

    const numOfContinuingIssues =
        continuingIssues && Object.values(continuingIssues).flat().length;
    const numOfResolvedIssues =
        resolvedIssues && Object.values(resolvedIssues).flat().length;
    const numOfNewIssues = Object.values(newIssues).flat().length;
    const numOfNewErrors = (Object.values(newIssues).flat(): Array<any>).filter(
        (issue) => issue?.type !== "warning"
    ).length;

    if (numOfContinuingIssues) {
        console.log(`${numOfContinuingIssues} existing issue(s)`);
    }

    if (numOfResolvedIssues) {
        console.log(`${numOfResolvedIssues} resolved issue(s)`);
    }

    if (numOfNewIssues) {
        console.log(
            `${numOfNewIssues} new issue(s)` +
                `${
                    numOfNewErrors
                        ? ` (${numOfNewErrors} of which are errors)`
                        : ""
                }`
        );
    }

    if (numOfNewErrors > 0) {
        process.exit(1);
    }

    if (numOfNewIssues > 0) {
        process.exit(2);
    }
}

/*
 * For an array of issues found by pa11y sort out which ones have previously
 * been logged and which ones are new.
 */
function findContinuingIssues(
    issues: Array<Object>,
    previousIssues: Array<Object>
) {
    const newIssues = [];
    const continuingIssues = [];
    let resolvedIssues = [...previousIssues];

    for (const issue of issues) {
        const isContinuingIssue = previousIssues.some(
            (previousIssue) =>
                previousIssue.selector === issue.selector &&
                previousIssue.message === issue.message
        );

        if (isContinuingIssue) {
            continuingIssues.push(issue);
            // Issue not resolved so remove from resolvedIssues
            resolvedIssues = resolvedIssues.filter(
                (previousIssue) =>
                    previousIssue.selector !== issue.selector ||
                    previousIssue.message !== issue.message
            );
        } else {
            newIssues.push(issue);
        }
    }

    return {
        newIssues,
        continuingIssues,
        resolvedIssues,
    };
}

/*
 * A generator function which loops over each page, runs pa11y then yield the
 * results.
 */
async function* checkNextPage() {
    const pathsToCheck = await fs.readJson(path.join(__dirname, "./pa11y-paths.json"));
    const port = process.env.PORT

    if (!port) {
        throw Error("PORT env var not set.")
    }

    const chromeLaunchConfig = {
        args: [
            "--headless",
            "--no-sandbox",
            "--acceptInsecureCerts=true",
            "--ignore-certificate-errors",
            "--disable-dev-shm-usage", // https://developers.google.com/web/tools/puppeteer/troubleshooting#running_on_alpine
        ],
    };

    process.stdout.write("Testing page accessibility");
    for (const [i, path] of pathsToCheck.entries()) {
        const uri = `http://localhost:${port}${path}`;
        if (!process.env.CI) {
            process.stdout.write(
                ansiEscapes.eraseStartLine +
                    ansiEscapes.cursorLeft +
                    `Testing page accessibility (${i + 1} of ${
                        pathsToCheck.length
                    })`
            );
        }
        yield {
            path,
            results: await pa11y(uri, {
                includeWarnings: true,
                standard: "WCAG2AA",
                runners: ["htmlcs"],
                chromeLaunchConfig,
                screenCapture: `${__dirname}/my-screen-capture.png`,
                hideElements: ".ScreenReader", // Our ScreenReader component uses
                // absolute positioning in order to make text visible to a
                // screen reader but not a sighted user. Pa11y doesn't like
                // absolute positioning so we need to disable this.
                // Unfortunately pa11y doesn't allow you to disable a
                // specific rule for a specific element
                // (https://github.com/pa11y/pa11y-ci/issues/158) so we just
                // wholesale ignore the component for now.
                ignore: [
                    // Ask Izzy's design currently features text over an image
                    // prominently in the Heading. This is something we've talked
                    // about changing for legibility reasons but for now that's
                    // what we've got.
                    "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage",
                    "WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.BgImage",
                ],
            }),
        };
    }
    process.stdout.write("\n");
}
