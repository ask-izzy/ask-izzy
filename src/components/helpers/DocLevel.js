/* @flow */
import React from "react"
import type {Node as ReactNode} from "react";
import LevelContext from '../../contexts/document-level-context.js'

export default function DocLevel (
    { children }: {children: ReactNode}
): ReactNode {
  return (
    <LevelContext.Consumer>
      {level =>
        <LevelContext.Provider value={(level || 0) + 1}>
          {children}
        </LevelContext.Provider>
      }
    </LevelContext.Consumer>
  )
}
