/* @flow */
// Using the correct heading level (h1, h2, etc) is important for screen readers
// and other non-visual methods of browsing. However it also requires an
// understanding of global information hierarchy of a page in order
// decide which level is needed. This posses an problem in that it breaks the
// componentisation paradigm which depends on components largely not need to worry
// about where they are used. To resolve this we use react contexts and a few
// helper functions to decide automatically which heading element is needed.
// This patten heavily cribs from
// https://medium.com/@Heydon/managing-heading-levels-in-design-systems-18be9a746fa3

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
          throw new Error('<Heading /> has been used without a <DocLevel /> parent.')
        }
        const Heading = 'h' + Math.min(level, 6)
        return (
            <Heading
                className={cx('Heading', `level-${Math.min(level, 6)}`, className)}
            >
                {children}
            </Heading>
        )
      }}
    </LevelContext.Consumer>
  )
}
