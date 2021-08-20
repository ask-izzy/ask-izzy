/* @flow */
// See Heading.js for more contextual info

import React from "react"
import type {Node as ReactNode} from "react";
import cx from "classnames"
import LevelContext from '../../contexts/document-level-context.js'

type Props = {
    className: string,
    children?: ReactNode
}

export default function Heading ({className, children}: Props): ReactNode {
  return (
    <LevelContext.Consumer>
      {level => {
        if (!level) {
          throw new Error('<Subheading /> has been used without a <DocLevel /> parent.')
        }
        return (
            <div
                className={cx('Subheading', `level-${Math.min(level, 6)}`, className)}
                role="doc-subtitle"
            >
                {children}
            </div>
        )
      }}
    </LevelContext.Consumer>
  )
}
