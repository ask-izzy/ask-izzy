/* @flow */
import React, {createContext} from "react";
import type {Context as ReactContext} from "react"

type Context = number | typeof undefined

export default (createContext<Context>(undefined): ReactContext<Context>)
