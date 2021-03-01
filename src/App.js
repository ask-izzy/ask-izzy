import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import routes from "./routes";
import HistoryListener from "./components/effects/HistoryListener"
//
// import { Link, Router } from 'components/Router'
// import Dynamic from 'containers/Dynamic'

import webpackStats from "./server/webpack-stats";
import HtmlDocument from "./server/HtmlDocument";

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App(helmet) {
  const Router = typeof document !== "undefined" ?
    BrowserRouter
    : MemoryRouter
    // const app = ReactDOMServer.renderToString(
    //     <StaticRouter location={req.url}
    //         context={context}
    //         isRenderingStatic={false}
    //     >{routes}</StaticRouter>
    // );
  return (
    <Root>
        <Router>
            <HistoryListener/>
            {routes}
        </Router>
    </Root>
  )
}

export default App
