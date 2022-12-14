export default async function handler(req: any, res: any) {
    const secret = req.query.secret;
    const path = req.query.slug;

    if (!process.env.STATIC_PAGE_PREVIEW_SECRET) {
        return res.status(501).json({ message: "Preview mode not enabled" });
    }

    if (secret !== process.env.STATIC_PAGE_PREVIEW_SECRET) {
        return res.status(401).json({ message: "Invalid token" });
    }

    if (!path) {
        return res
            .status(400)
            .json({ message: "Parameter `slug` is not provided" });
    }

    res.setPreviewData({});

    res.redirect(307, path);
}
