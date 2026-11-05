// Writes the lookup table from ISS3 "q" values to the flows which produce them
// to src/constants/related-search-flows.json. Rerun whenever categories or
// personalisation pages change how the search query is built (the unit tests
// fail if the committed table is out of date).
// See docs/other-services-panel.md § "Turning a related search back into a flow"
//
// Usage: yarn generate-related-search-flows

import fs from "fs"
import path from "path"

import {buildRelatedSearchFlows} from "./lib/related-search-flows"

const outputPath = path.resolve(
    __dirname,
    "../src/constants/related-search-flows.json",
)
const flows = buildRelatedSearchFlows()
fs.writeFileSync(outputPath, JSON.stringify(flows, null, 2) + "\n")
console.log(
    `Wrote ${Object.keys(flows).length} "q" values to ${outputPath}`
)
