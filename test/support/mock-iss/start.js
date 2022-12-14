#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

require("@babel/register");
const path = require("path");
const loadEnvConfig = require("@next/env").loadEnvConfig

const startServer = require(path.join(__dirname, "./index.js")).initMockISSServer

const projectDir = process.cwd()
loadEnvConfig(projectDir)

startServer()
