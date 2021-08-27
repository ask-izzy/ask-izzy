/* @flow */
// See Heading.js for more contextual info

import React from "react"
import type {Node as ReactNode} from "react";
import cx from "classnames"
import LevelContext from '../../contexts/document-level-context.js'

type Props = {
    className?: string,
    children?: ReactNode,
    typeSize?: number
}

export default function Heading ({className, children, typeSize}: Props): ReactNode {
  return (
    <LevelContext.Consumer>
      {level => {
        if (!level) {
          throw new Error('<Subheading /> has been used without a <DocLevel /> parent.')
        }

        const subheadingLevel = Math.min(level, 6)

        if (typeof typeSize === 'undefined') {
            typeSize = subheadingLevelToTypeSize[subheadingLevel]
        }

        return (
            <div
                className={cx('Subheading', `level-${typeSize}`, className)}
                role="doc-subtitle"
            >
                {children}
            </div>
        )
      }}
    </LevelContext.Consumer>
  )
}

const subheadingLevelToTypeSize = {
    '1': 2,
    '2': 1,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
}
