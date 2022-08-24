/* @flow */

import type {Element as ReactElement} from "react"
import React from "react";
import Link from "./base/Link";
import MyList from "../icons/MyList"
import useMyList from "@/hooks/useMyList"

type Props = {
    hasTextDescription?: boolean,
}

function MyListButton({
    hasTextDescription = false,
}: Props): ReactElement<typeof Link> {
    const {myListServices} = useMyList()

    return (
        <Link className="MyListButton"
            to="/my-list"
            aria-label={`MyList, ${myListServices.length} items saved`}
        >
            <div className="list-button">
                <MyList />
            </div>
            <span className="title">My List</span>
            <div className="my-list-count">
                {myListServices.length < 100 ? myListServices.length : "99+"}
            </div>
        </Link>
    )
}

export default MyListButton
