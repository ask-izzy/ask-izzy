export default (
    parent, args, context, info
) => {
    const pathToFilterBy = args?.where?.Path || info?.variableValues?.path
    return pages
        .filter(page => !pathToFilterBy || (page.Path === pathToFilterBy))
}

export const aboutPage = {
    Title: "About Ask Izzy",
    Path: "/about",
    Body: "We’re always making improvements.",
    Banner: {
        Key: "food",
    },
    BannerTextPrimary: "About Ask Izzy",
    BannerTextSecondary: "Some secondary text",

}

export const termsPage = {
    Title: "Our Terms",
    Path: "/terms",
    BannerTextPrimary: "Our Terms",
    Body: "Try to live a good life",
}

export const homelessSheltersPage = {
    Title: "Shelter Services",
    Path: "/homeless-shelters",
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
    Path: "/disability-organisations",
    BannerTextPrimary: "Disability Organisations",
    Body: "Try to live a good life\n\n> [callout(test)]",
}

export const informationPage = {
    Title: "Information",
    Path: "/information",
    BannerTextPrimary: "Information",
    Body: ("Try to live a good life\n\n> [callout(test)] " +
        "[callout(nothing)]"),
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

const foodInfoPage1 = {
    Title: "Page 1",
    BannerTextPrimary: "Page 1",
    Path: "/food-info",
}
const foodInfoPage2 = {
    Title: "Page 2",
    BannerTextPrimary: "Page 2",
    Path: "/food-info",
}

const pages = [
    aboutPage,
    termsPage,
    homelessSheltersPage,
    disabilityOrganisationsPage,
    informationPage,
    foodInfoPage1,
    foodInfoPage2,
]
