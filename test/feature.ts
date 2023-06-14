import nextEnv from "@next/env"

const {loadEnvConfig} = nextEnv

import runTests from "./yadda.js";

const projectDir = process.cwd()
loadEnvConfig(projectDir)

runTests("./test/features");
