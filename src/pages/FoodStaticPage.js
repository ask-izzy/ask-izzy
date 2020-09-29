/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";

export default class FoodBanksStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Finding Food"
                bannerName="food static"
            >
                <h1>Finding Food</h1>
                <p>
                    If you're having trouble feeding yourself or your family, help is available. The kind of help you can get will depend on your situation, where you live, and other things like your age. This page describes some of the common types of food support, and tells you where you can find them.
                </p>
                <h2>Community Meals</h2>
                <p>Community meals are cheap or free meals that are offered by charitable and social organisations in your community. These meals will usually be served at a location such as a church, a community centre, or a food van. Community meals will usually only be available at certain times of day, and certain days of the week. Community meals can also be a chance to have a conversation with other members of your community, or to find someone that can offer you other kinds of help and support.</p>
                <p>
                    You can use <Link to="/search/meals -(food safety) -(home care) -(meals on wheels) -(assistance with meals) -(hire of facilities) -chsp -(meal preparation)">Ask Izzy</Link> to find Community Meals near you.
                </p>

                <h2>Food Parcels and Vouchers</h2>
                <p>Some organisations will provide food parcels and pantry items that you can take home to eat, or vouchers that you can use to purchase food at a supermarket. These organisations may also be able to help you with other needs such as warm clothes, financial advice, or help with finding housing.</p>
                <p>
                    You can use <Link to="/search/(Food Parcels & Food Vouchers) -(coordinating bodies) -(food safety) -(home care) -(meals on wheels) -(assistance with meals) -(hire of facilities) -chsp -(meal preparation)">Ask Izzy</Link> to find Food Parcels and Vouchers near you.
                </p>

                <h2>Meals on Wheels</h2>
                <p>Each state in Australia has a Meals on Wheels service. This service provides affordable meals to people who cannot easily leave their homes, due to age or disability. This can be either short term, for example after an operation, or longer term.</p>
                <p>Meals on Wheels is usually managed by your local council, or your rural health network. You will need to contact them to find out if you are eligible.</p>
                <p>
                    You can find details at{" "}
                    <a href="https://mealsonwheels.org.au/find-us/"
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        Meals on Wheels Australia
                    </a> or in <Link to="/search/meals on wheels">Ask Izzy</Link>.
                </p>

                <p><strong>
                    You can use the <Link to="/food">food search</Link> on the Ask Izzy home page to find food support near you.
                </strong></p>
            </StaticPage>
        );
    }
}
