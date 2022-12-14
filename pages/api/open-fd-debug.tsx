import { lsof } from "list-open-files"
export default async function handler(req: any, res: any): Promise<void> {
    // Obviously not super secure but we're only trying to make this
    // slightly more secuire than an unlisted url
    const { auth } = req.query
    if (!process.env.STATIC_PAGE_REGENERATION_SECRET || (auth !== process.env.STATIC_PAGE_REGENERATION_SECRET)) {
        return res.status(404).send("404")
    }

    try {
        const processInfos = await lsof()

        const files = processInfos[0]?.files
        if (!files) {
            return res.status(500).send("no files")
        }
        const sockets = files.filter(file => (file.type === "IP") && (file as MyProcessFile).from)
        const nonSockets = files.filter(file => (file.type !== "IP") || !(file as MyProcessFile).from)
        const incomingSockets = sockets.filter(socket => (socket as MyProcessFile).from.port === 8000)
        const outgoingSockets = sockets.filter(socket => (socket as MyProcessFile).from.port !== 8000)
        return res.status(200).send({
            incomingSockets,
            outgoingSockets,
            nonSockets,
        })
    } catch (error) {
        return res.status(500).send("error: " + error)
    }
}