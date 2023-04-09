import { loadEnvConfig } from "@next/env"

import runTests from "./yadda.js";


const projectDir = process.cwd()
loadEnvConfig(projectDir)

runTests("./test/features");
