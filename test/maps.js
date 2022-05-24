/* @flow */
import { loadEnvConfig } from "@next/env"

import runTests from "./yadda";

const projectDir = process.cwd()
loadEnvConfig(projectDir)

runTests("./test/maps");
