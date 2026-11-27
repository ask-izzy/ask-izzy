// Writes src/related-searches/related-search-flows.generated.json
// (gitignored). Runs before `yarn build` and `yarn dev`.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

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
