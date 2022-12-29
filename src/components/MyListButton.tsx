import React from "react"
import Link from "@/src/components/base/Link.js";
import MyList from "@/src/icons/MyList.js"
import useMyList from "@/hooks/useMyList.js"

function MyListButton() {
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
