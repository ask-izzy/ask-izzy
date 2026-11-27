// Writes the lookup table from ISS3 "q" values to the flows which produce them
// to src/related-searches/related-search-flows.generated.json (gitignored).
// Run automatically before `yarn build` and `yarn dev`. The deploy rebuild
// reuses the one generated when the Docker image was built, since the table
// doesn't depend on environment variables.
// See docs/other-services-panel.md § "Turning a related search back into a flow"
//
// Usage: yarn generate-related-search-flows

import fs from "fs"
import path from "path"

import {buildRelatedSearchFlows} from "./lib/related-search-flows"

const outputPath = path.resolve(
    __dirname,
    "../src/related-searches/related-search-flows.generated.json",
)
const flows = buildRelatedSearchFlows()
fs.writeFileSync(outputPath, JSON.stringify(flows) + "\n")
console.log(
    `Wrote ${Object.keys(flows).length} "q" values to ${outputPath}`
)
