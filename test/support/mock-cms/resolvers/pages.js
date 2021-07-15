/* @flow */

export default (
    parent: Object, args: Object, context: Object, info: Object
) => {
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
            {Title: "Page 1"},
            {Title: "Page 2"},
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
    BannerTextPrimary: "Some primary text",
    BannerTextSecondary: "Some secondary text",
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

export const termsPage = {
    Title: "Our Terms",
    Body: "Try to live a good life",
}

export const homelessSheltersPage = {
    Title: "Shelter Services",
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
    Body: "Try to live a good life\n\n> [callout(test)]",
}

export const informationPage = {
    Title: "Information",
    Body: "Try to live a good life\n\n> [callout(test)] " +
        "[callout(nothing)]",
}
