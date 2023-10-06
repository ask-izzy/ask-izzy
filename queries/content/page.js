/* @flow */

import gql from "graphql-tag";

import {calloutFragment} from "./callout"
import type {CmsCalloutBoxFragmentType} from "./callout"

const pageQuery: any = gql`
query Page($path: String!) {
    pages(filters: {Path: {eq: $path} }) {
        data {
            attributes {
                Body,
                Path,
                Title,
                Banner {
                    data {
                        attributes {
                            Key
                        }
                    }
                }
                BannerTextPrimary,
                BannerTextSecondary,
                AccordionTitle,
                Accordion {
                    id,
                    Title,
                    Content,
                },
                CalloutBoxes {
                    Top,
                    Bottom,
                    callout {
                        data {
                            ...CalloutBox
                        }
                    }
                }
            }
        }
    }
}
${calloutFragment}
`;

export default pageQuery;

export type CmsResponsePage = {
    pages: {
        data: Array<CmsPage>
    } | null
}

export type CmsPage = {
    attributes: {
        Body: string | null,
        Path: string,
        Title: string,
        Banner: CmsBanner | null,
        BannerTextPrimary: string,
        BannerTextSecondary: string,
        AccordionTitle: string,
        Accordion: Array<CmsAccordion> | null,
        CalloutBoxes: Array<CmsCalloutBox> | null
    } | null
}

type CmsBanner = {
    data: {
        attributes: {
            Key: string
        } | null
    } | null
}

type CmsAccordion = {
    id: number,
    Title: string,
    Content: string | null,
}

type CmsCalloutBox = {
    Top: boolean | null,
    Bottom: boolean | null,
    callout: {
        data: CmsCalloutBoxFragmentType | null,
    } | null
}
