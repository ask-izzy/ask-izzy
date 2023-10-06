/* @flow */

type Page = {|
    attributes: {|
        Title: string,
        Path: string,
        Body?: string,
        Banner?: {|
            attributes: {|
                Key: string
            |}
        |},
        BannerTextPrimary?: string,
        BannerTextSecondary?: string,
        CalloutBoxes?: Array<{
            Top: boolean,
            Bottom: boolean,
            callout: {
                data: {
                    attributes: {
                        ShowHeading: boolean,
                        Heading: string,
                    }
                }
            }
        }>,
        Accordion?: Array<{
            id: number,
            Title: string,
            Content: string,
        }>

    |},
|}

export default (
    parent: Object, args: Object, context: Object, info: Object
): {data: Array<Page>} => {
    const pathToFilterBy = args?.filters?.Path.eq || info?.variableValues?.path
    return {
        data: pages.filter(page => !pathToFilterBy || (page.attributes?.Path === pathToFilterBy)),
    }
}

export const aboutPage: Page = {
    attributes: {
        Title: "About Ask Izzy",
        Path: "/about",
        Body: "We’re always making improvements.",
        Banner: {
            attributes: {
                Key: "food",
            },
        },
        BannerTextPrimary: "About Ask Izzy",
        BannerTextSecondary: "Some secondary text",
    },
}

export const termsPage: Page = {
    attributes: {
        Title: "Our Terms",
        Path: "/terms",
        BannerTextPrimary: "Our Terms",
        Body: "Try to live a good life",
    },
}

export const homelessSheltersPage: Page = {
    attributes: {
        Title: "Shelter Services",
        Path: "/homeless-shelters",
        Body: "Information about Homeless Shelters.",
        BannerTextPrimary: "Shelter Services",
        CalloutBoxes: [
            {
                Top: true,
                Bottom: false,
                callout: {
                    data: {
                        attributes: {
                            ShowHeading: true,
                            Heading: "Ask Izzy can help",
                        },
                    },
                },
            },
        ],
    },
}

export const disabilityOrganisationsPage: Page = {
    attributes: {
        Title: "Disability Organisations",
        Path: "/disability-organisations",
        BannerTextPrimary: "Disability Organisations",
        Body: "Try to live a good life\n\n> [callout(test)]",
    },
}

export const informationPage: Page = {
    attributes: {
        Title: "Information",
        Path: "/information",
        BannerTextPrimary: "Information",
        Body: ("Try to live a good life\n\n> [callout(test)] " +
            "[callout(nothing)]": string),
        Accordion: [
            {
                id: 1,
                Title: "Victoria",
                Content: "Accordion content for Victoria.",
            },
            {
                id: 2,
                Title: "Tasmania",
                Content: "Accordion content for Tasmania.",
            },
        ],
    },
}

const foodInfoPage1: Page = {
    attributes: {
        Title: "Page 1",
        BannerTextPrimary: "Page 1",
        Path: "/food-info",
    },
}
const foodInfoPage2: Page = {
    attributes: {
        Title: "Page 2",
        BannerTextPrimary: "Page 2",
        Path: "/food-info",
    },
}

const pages: Array<Page> = [
    aboutPage,
    termsPage,
    homelessSheltersPage,
    disabilityOrganisationsPage,
    informationPage,
    foodInfoPage1,
    foodInfoPage2,
]
