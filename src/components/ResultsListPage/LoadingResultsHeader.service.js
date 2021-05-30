/* @flow */

export const formatResultsPageHeading = (title: string) => {
    switch (title) {
    case "health":
    case "support & counselling":
    case "money help":
    case "legal":
    case "advocacy":
    case "life skills & education":
        return `Showing ${title} services to help with:`;
    case "finding work":
        return "Showing services to help:";
    case "facilities":
        return "Showing places and services with bathrooms:";
    case "something to do":
        return "Showing community and leisure services:";
    case "technology":
        return "Showing places to connect to the internet:";
    case "centrelink":
        return "Showing Centrelink sites for:";
    default:
        return `Showing ${title} services for:`;
    }
}
