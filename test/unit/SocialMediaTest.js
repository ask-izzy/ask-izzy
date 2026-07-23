/* @flow */
/* eslint-env node, mocha */

import assert from "assert";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import SocialMedia from "../../src/components/SocialMedia";

describe("SocialMedia", function() {
    it("renders a formatted Twitter / X label with an icon", function() {
        const html = renderToStaticMarkup(
            <SocialMedia
                type="twitter"
                url="https://x.com/askizzy"
            />
        );

        assert(html.includes("Twitter / X link:"));
        assert(html.includes("<span class=\"web value\">Twitter / X</span>"));
        assert(html.includes("href=\"https://x.com/askizzy\""));
        assert(html.includes("<svg"));
    });

    it("treats type matching as case-insensitive", function() {
        const html = renderToStaticMarkup(
            <SocialMedia
                type="LiNkEdIn"
                url="https://linkedin.com/company/askizzy"
            />
        );

        assert(html.includes("LinkedIn link:"));
        assert(html.includes("<span class=\"web value\">LinkedIn</span>"));
        assert(html.includes("<svg"));
    });

    it("falls back to the raw type and no icon for unknown social media types", function() {
        const html = renderToStaticMarkup(
            <SocialMedia
                type="Mastodon"
                url="https://mastodon.social/@askizzy"
            />
        );

        assert(html.includes("Mastodon link:"));
        assert(html.includes("<span class=\"web value\">Mastodon</span>"));
        assert(!html.includes("<svg"));
    });
});