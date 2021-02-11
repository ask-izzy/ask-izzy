/* @flow */
/* eslint-disable max-len */

import React from "react";
import Link from "../components/Link";
import StaticPage from "./StaticPage";

export default class FoodBanksStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Food Banks"
                bannerName="food static"
            >
                <h1>Food banks</h1>
                <p>If you are unable to buy groceries because of lack of income, an unexpected life event or large expense you can visit a food bank to get what you need. </p>
                <p>
                    Each year, food banks across Australia provide groceries and other essential items to thousands of people in similar situations to yours.
                    To find your closest food bank, <Link to="/food">search Ask Izzy</Link> now.
                </p>
                <h2>What can I get at a food bank?</h2>
                <p>A food bank provides free or low-cost food and other goods to people who need them. They usually stock basic, non-perishable food items like sauces, canned goods, pasta and rice. Depending on availability, toiletries like shampoo, soap and sanitary products are also available.</p>
                <p>The products come from different sources including supermarkets, personal donations and wholesalers.</p>
                <h2>Where can I find a food bank?</h2>
                <p>
                    There are food banks across the country, in regional and metropolitan
                    areas. <Link to="/food">Find a food bank near you</Link> or browse:
                </p>
                <ul>
                    <li><Link to="/food/Adelaide-SA">Food banks in Adelaide</Link></li>
                    <li><Link to="/food/Brisbane-QLD">Food banks in Brisbane</Link></li>
                    <li><Link to="/food/Canberra-ACT">Food banks in Canberra</Link></li>
                    <li><Link to="/food/Darwin-NT">Food banks in Darwin</Link></li>
                    <li><Link to="/food/Melbourne-VIC">Food banks in Melbourne</Link></li>
                    <li><Link to="/food/Perth-WA">Food banks in Perth</Link></li>
                    <li><Link to="/food/Sydney-NSW">Food banks in Sydney</Link></li>
                </ul>
            </StaticPage>
        );
    }
}
