/* eslint-env node, mocha */
import { loadEnvConfig } from "@next/env"

import Yadda from "yadda";

const projectDir = process.cwd()
loadEnvConfig(projectDir)

/* eslint-disable-next-line prefer-arrow-callback */
describe("Unit tests", function() {
    new Yadda.FileSearch(
        "./test/unit",
        /.*\.js$/
    ).each(file => require("../" + file));
});
