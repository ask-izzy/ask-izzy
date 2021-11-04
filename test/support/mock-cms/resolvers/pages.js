/* @flow */

type Page = {
    Title?: string,
    Body?: string,
    Banner?: {
        Key: string,
    },
    BannerTextPrimary?: string,
    BannerTextSecondary?: string,
    Accordion?: Array<{
        id: number,
        Title: string,
        Content: string
    }>
}

export default (
    parent: Object, args: Object, context: Object, info: Object
): Array<Page> => {
    const path = args?.where?.Path || info?.variableValues?.path
    if (path === "/about") {
        return [aboutPage]
    } else if (path === "/terms") {
        return [termsPage]
    } else if (path === "/online-safety") {
        return []
    } else if (path === "/homeless-shelters") {
        return [homelessSheltersPage]
    } else if (path === "/disability-organisations") {
        return [disabilityOrganisationsPage]
    } else if (path === "/information") {
        return [informationPage];
    } else if (path === "/food-info") {
        return [
            {Title: "Page 1", BannerTextPrimary: "Page 1"},
            {Title: "Page 2", BannerTextPrimary: "Page 2"},
        ]
    }
    return [{}]
}

export const aboutPage = {
    Title: "About Ask Izzy",
    Body: "We’re always making improvements.",
    Banner: {
        Key: "food",
    },
    BannerTextPrimary: "About Ask Izzy",
    BannerTextSecondary: "Some secondary text",
    
}

export const termsPage = {
    Title: "Our Terms",
    BannerTextPrimary: "Our Terms",
    Body: "Try to live a good life",
}

export const homelessSheltersPage = {
    Title: "Shelter Services",
    Body: "Information about Homeless Shelters.",
    BannerTextPrimary: "Shelter Services",
    CalloutBoxes: [
        {
            Top: true,
            Bottom: false,
            callout: {
                ShowHeading: true,
                Heading: "Ask Izzy can help",
            },
        },
    ],
}

export const disabilityOrganisationsPage = {
    Title: "Disability Organisations",
    BannerTextPrimary: "Disability Organisations",
    Body: "Try to live a good life\n\n> [callout(test)]",
}

export const informationPage = {
    Title: "Information",
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
}
