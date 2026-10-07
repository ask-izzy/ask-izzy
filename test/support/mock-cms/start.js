#!/usr/bin/env node

require("../../../babel-register");
const path = require("path");
const loadEnvConfig = require("@next/env").loadEnvConfig
const startServer = require(path.join(__dirname, "./index")).initMockCMSServer

const projectDir = process.cwd()
loadEnvConfig(projectDir)

startServer()
