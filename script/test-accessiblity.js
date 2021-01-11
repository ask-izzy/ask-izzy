/* @flow */
import pa11y from "pa11y";
import path from "path";
import ansiEscapes from "ansi-escapes";

import * as renderStatic from "../src/server/render-static";
import routes from "../src/routes";
import categories from "../src/constants/categories";

// Self executing func so await can be used
;(async () => {
    try {
        await checkForIssues(process.argv.includes("--ignore-existing-issues"))
    } catch(error) {
        if (error.message !== '') {
            console.error(error)
        }
        process.exit(1)
    }
})()

async function checkForIssues(ignoreExistingIssues) {
    let hasNewIssues = false;
    const existingIssues = [];
    for await (const {results, filePath} of checkNextPage()) {
        if (!Array.isArray(results.issues)) {
            console.error('Testing failed for unknown reason')
            return
        }
        let newIssues;
        if (ignoreExistingIssues) {
            newIssues = [];
            for (const issue of results.issues) {
                const isExistingIssue = (getExistingIssues()[filePath] || [])
                    .some(
                        (existingIssue) =>
                            existingIssue.selector === issue.selector &&
                            existingIssue.message === issue.message
                    );

                if (isExistingIssue) {
                    existingIssues.push(issue);
                } else {
                    newIssues.push(issue);
                }
            }
        } else {
            newIssues = results.issues;
        }

        if (newIssues.length > 0){
            process.stdout.write(
                ansiEscapes.eraseStartLine +
                ansiEscapes.cursorLeft
            );
            console.error(`${newIssues.length} issue(s) found with ${filePath}`);
            console.error(newIssues);
            hasNewIssues = true
            if (process.env.CI || process.env.FAIL_FAST) {
                throw new Error()
            }
        }
    }

    if (existingIssues.length > 0) {
        console.log(`${existingIssues.length} existing issue(s)`);
    }

    if (hasNewIssues) {
        throw new Error()
    }
}

async function* checkNextPage() {
    const sampleCategories = [categories[0]];
    const publicDir = path.join(__dirname, "../public");
    const pages = renderStatic.getPagesFromRoutes(routes, sampleCategories);

    process.stdout.write("Testing page accessibility")
    for (const [i, page] of pages.entries()) {
        const uri = `file://${publicDir}${page.filePath}`;
        if (!process.env.CI) {
            process.stdout.write(
                ansiEscapes.eraseStartLine +
                ansiEscapes.cursorLeft +
                `Testing page accessibility (${i + 1} of ${pages.length})`
            );
        }
        yield {...page, results: await pa11y(uri)};
    }
    process.stdout.write("\n")
}

function getExistingIssues() {
  return {
    "/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector: "#chevron",
        message:
          'Duplicate id attribute value "chevron" found on the web page.',
      },
      {
        selector: "#XMLID_674_",
        message:
          'Duplicate id attribute value "XMLID_674_" found on the web page.',
      },
      {
        selector: "#Layer_2",
        message:
          'Duplicate id attribute value "Layer_2" found on the web page.',
      },
      {
        selector: "#Layer_1-2",
        message:
          'Duplicate id attribute value "Layer_1-2" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/about/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/bushfire-support/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/covid-19-support/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector: "#phone",
        message: 'Duplicate id attribute value "phone" found on the web page.',
      },
      {
        selector: "#website",
        message:
          'Duplicate id attribute value "website" found on the web page.',
      },
      {
        selector: "#XMLID_1040_",
        message:
          'Duplicate id attribute value "XMLID_1040_" found on the web page.',
      },
      {
        selector: "#XMLID_1079_",
        message:
          'Duplicate id attribute value "XMLID_1079_" found on the web page.',
      },
      {
        selector: "#XMLID_1041_",
        message:
          'Duplicate id attribute value "XMLID_1041_" found on the web page.',
      },
      {
        selector: "#chevron",
        message:
          'Duplicate id attribute value "chevron" found on the web page.',
      },
      {
        selector: "#XMLID_674_",
        message:
          'Duplicate id attribute value "XMLID_674_" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/terms/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/online-safety/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/beta-info/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector: "#chevron-back",
        message:
          'Duplicate id attribute value "chevron-back" found on the web page.',
      },
      {
        selector: "#XMLID_1_",
        message:
          'Duplicate id attribute value "XMLID_1_" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/homeless-shelters/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/food-info/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/homeless-support/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/homeless-legal-services/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/homeless-financial-support/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/homeless-health-care/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/information/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/not-found/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
    "/add-service/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector: "#root > div > main > div > div:nth-child(2) > div > iframe",
        message:
          "Iframe element requires a non-empty title attribute that identifies the frame.",
      },
    ],
    "/service/slug/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/map/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/map/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/map/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/:suburb-:state/map/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/map/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/:suburb-:state/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/:suburb-:state/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/:suburb-:state/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/map/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/map/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/map/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/map/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/map/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/search/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/search/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/page/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/summary/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/map/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/page/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/summary/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/:suburb-:state/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/personalise/page/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/map/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/personalise/summary/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/map/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/personalise/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/personalise/page/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/personalise/page/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/rent-and-tenancy/personalise/summary/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/personalise/summary/intro/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
    ],
    "/rent-and-tenancy/personalise/summary/location/index.html": [
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > div:nth-child(2) > div > div:nth-child(2) > form",
        message:
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
      },
    ],
    "/*/index.html": [
      {
        selector:
          "#root > div > main > div > div:nth-child(1) > div:nth-child(1) > button",
        message:
          "This button element does not have a name available to an accessibility API. Valid names are: title undefined, element content, aria-label undefined, aria-labelledby undefined.",
      },
      {
        selector: "#Layer_1",
        message:
          'Duplicate id attribute value "Layer_1" found on the web page.',
      },
      {
        selector:
          "#root > div > main > div > footer > div:nth-child(5) > div:nth-child(2) > div > a:nth-child(1)",
        message:
          "Anchor element found with a valid href attribute, but no link content has been supplied.",
      },
    ],
  };
}
