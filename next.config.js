/* $FlowIgnore */
const path = require("path")
const globImporter = require("node-sass-glob-importer");
const fs = require("fs");
const { withSentryConfig } = require("@sentry/nextjs");

require("./lib/env-var-check.js")

const bannerImages = fs.readdirSync("./public/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));

module.exports = {
    sassOptions: {
        importer: globImporter(),
        includePaths: [
            path.join(__dirname, "src/styles"),
        ],
        prependData: `$banner-images: ${bannerImages.join(" ")};`,
    },
    async generateBuildId() {
        return process.env.TASK_DEFINITION_REVISION || `${Math.floor(Date.now() / 1000)}`
    },
    async rewrites() {
        return {
            beforeFiles: [
                ...getRewriteForProxy(),
            ],
            afterFiles: [
                {
                    source: `/search/:search/:remainingPath*`,
                    destination: `/search/:remainingPath*?search=:search`,
                },
                {
                    source: `/search/:search/:suburb-:state/:remainingPath*`,
                    destination:
                        `/search/:remainingPath*?suburb=:suburb&state=:state` +
                            `&search=:search`,
                },
                {
                    source: "/VERSION",
                    destination: "/VERSION.txt",
                },
                ...getRewritesForCategories(),
            ],
        }
    },
    async redirects() {
        return [
            {
                source: "/about",
                destination: "https://about.askizzy.org.au/about/",
                permanent: false,
            },
            {
                source: "/donate",
                destination: "https://infoxchange.giveeasy.org/ask-izzy",
                permanent: false,
            },
            {
                source: "/have-your-say/:remainingPath*",
                destination: "/advocacy/:remainingPath*",
                permanent: true,
            },
            {
                source: "/category/:page",
                destination: "/:page",
                permanent: true,
            },
            {
                source: "/category/:page/in/:suburb-:state",
                destination: "/:page/:suburb-:state",
                permanent: true,
            },
            {
                source: "/search/:search/in/:suburb-:state",
                destination: "/search/:search/:suburb-:state",
                permanent: true,
            },
            {
                source: "/have-your-say/:page*",
                destination: "/advocacy/:page*",
                permanent: true,
            },
            {
                source: "/components-catalog/:remainingPath*",
                destination: "/storybook/:remainingPath*",
                permanent: true,
            },
            {
                source: "/storybook",
                destination: "/storybook/index.html",
                permanent: false,
            },
        ]
    },
    webpack: (config) => {
        config.resolve.fallback = {
            net: false,
            tls: false,
        };

        return config;
    },
    env: {
        ENVIRONMENT: process.env.ENVIRONMENT,
        DOMAINS_TO_PROXY: getDomainsToProxy(),
    },
    transpilePackages: [
        "is-plain-obj",
        "@googlemaps/js-api-loader",
        "@react-google-maps/api",
        "@react-google-maps/api/node_modules/@googlemaps/js-api-loader",
        "mdast-util-find-and-replace",
        "color-convert",
        "json-schema-ref-parser",
        "ono",
        "escape-string-regexp",
        "readable-stream",
        "bl/node_modules/readable-stream",
        "browserify-sign/node_modules/readable-stream",
        "hash-base/node_modules/readable-stream",
        "tar-stream/node_modules/readable-stream",
        "are-we-there-yet/node_modules/readable-stream",
        "next/dist/compiled/crypto-browserify",
        "next/dist/compiled/stream-browserify",
        "next/dist/compiled/stream-http",
        "postcss-html/node_modules/readable-stream",
        "@clevercanyon/merge-change.fork",
    ],
    // We need to manually handle trailing slash redirection so as not to apply redirect to requests to our external
    // resources proxy
    skipTrailingSlashRedirect: true,
    sentry: {
        hideSourceMaps: false,
        tunnelRoute: "/error-monitoring/sentry",
    },
}

function getRewriteForProxy() {
    if (process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX) {
        return [
            {
                source: "/:path*",
                has: [
                    {
                        type: "host",
                        value: `.*.${process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX}`,
                    },
                ],
                destination: "/api/external-resource-proxy/:path*",
            },
        ]
    }
    return []
}

function getRewritesForCategories() {
    const rewrites = []

    // We want to know the names of the different categories but Next.js doesn't
    // yet support loading this file with babel or a typescript complier so
    // we can't import source files directly here. But we can do a really ugly
    // hack where read the categories.js file in as plain text and regex out the
    // names.
    const categoryKeys = fs.readFileSync(
        "./src/constants/categories.js",
        {encoding: "utf8"}
    )
        .split("\n")
        .map(line => line.match(/^\s+key: "([^"]+)",\s*/)?.[1])

    for (const categoryKey of categoryKeys) {
        rewrites.push({
            source: `/${categoryKey}/:suburb-:state/:remainingPath*`,
            destination:
                `/${categoryKey}/:remainingPath*?suburb=:suburb&state=:state`,
        })
    }

    return rewrites
}

if (process.env.NODE_ENV !== "test") {
    module.exports = withSentryConfig(
        module.exports,
        {
            silent: true,
        }
    )
}

function getDomainsToProxy() {
    return (process.env.DOMAINS_TO_PROXY || "")
        .split(",")
        .map(domain => domain.trim())
}
