import React from "react"

type Props = {
    children: any,
    node: any,
    className?: string
}

/**
 * When setting an inline image via strapi proceeded by plain text
 * The CSS won't pick up the text as being a child, therefore the
 * nth-child(2) check doesn't work. What this does is a bit hacky,
 * but wraps the text in a <span> so then the CSS picks it up as
 * a child
 * @param props - Markdown props
 * @return {JSX.Element} - The paragraph
 */
export default function Paragraph({children, node}: Props) {

    // finds the index of a text node
    const textIndex = node.children.findIndex(
        child => child.type === "text");

    // Get the image children indexes
    const imageIndexList: Array<number> = [];
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].type === "image") {
            imageIndexList.push(i);
        }
    }

    // Checks if the paragraph contains an image
    const hasImg = node.children.find(child => child.type === "image")
    const newChildren = [...children];
    if (hasImg && textIndex > -1) {
        let style = {};

        // if the text is just spaces then set the left and right margins
        // to the pixel value of the spaces
        if (!children[textIndex].props.value.trim().length) {
            style = {
                marginLeft: children[textIndex].props.value.length,
                marginRight: children[textIndex].props.value.length,
            }
        }
        // Wraps the child element in a span
        newChildren[textIndex] = (
            <span
                key={`${textIndex}_${children[textIndex].key}`}
                style={style}
            >
                {children[textIndex]}
            </span>
        );

        // render each image child with the height style added, to ensure
        // that the inline images are the same height as the text
        imageIndexList.forEach(imageIndex => {
            newChildren[imageIndex] = (
                <img
                    key={
                        `${imageIndex}_${children[imageIndex].props.alt}`
                    }
                    className="inlineIcon"
                    {...children[imageIndex].props}
                />)
        })
    }

    return (
        <p className="Paragraph">
            {newChildren}
        </p>
    );
}
