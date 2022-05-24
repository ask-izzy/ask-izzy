#!/usr/bin/env node
/* @flow */

require("@babel/register");
const path = require("path");
const loadEnvConfig = require("@next/env").loadEnvConfig

// $FlowIgnore
const startServer = require(path.join(__dirname, "./index.js")).initMockISSServer

const projectDir = process.cwd()
loadEnvConfig(projectDir)

startServer()
