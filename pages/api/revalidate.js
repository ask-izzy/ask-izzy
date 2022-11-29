/* @flow */
import cmsAllPagesQuery from "@/queries/content/allPages"
import {queryGraphQlWithErrorLogging} from "@/src/utils/apolloClient";

// $FlowIgnore This would be fiddly to type correctly using flow.js
// so instead let's not bother and fix it up when we move to typescript
export default async function handler(req: any, res: any): any {
    if (req.query.secret !== process.env.STATIC_PAGE_REGENERATION_SECRET) {
        return res.status(401).json({ message: "Invalid token" });
    }

    if (req.body.event === "trigger-test") {
        res.send("Test successful");
        return
    }

    const modifiedCollectionType = req.body.model

    if (modifiedCollectionType === "page") {
        return regeneratePages([req.body.entry.Path], res)

    } else if (modifiedCollectionType === "callout") {
        const calloutId = req.body.entry.id
        let contentPages
        try {
            const { data } = await queryGraphQlWithErrorLogging({
                query: cmsAllPagesQuery,
                fetchPolicy: "no-cache",
            })
            contentPages = data.pages
        } catch (error) {
            throw error
        }
        const pathsToRegenerate = contentPages.filter(
            page => page.CalloutBoxes.some(
                calloutBox => calloutBox.callout.id === calloutId
            )
        ).map(page => page.Path)

        return regeneratePages(pathsToRegenerate, res)
    }

    return res.status(500).send("Error revalidating");
}

async function regeneratePages(paths: Array<string>, res) {
    try {
        for (const path of paths) {
            res.revalidate(path);
        }
        return res.json({ revalidated: true });
    } catch (error) {
        console.log(error)
        console.error("An error occurred when attempting to regenerate:", paths)
        return res.status(500).send("Error revalidating");
    }
}
