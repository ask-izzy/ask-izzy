import React from "react";
import Router, {RouteHandler} from 'react-router';
import HeaderBar from "../components/HeaderBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

class HomePage extends React.Component {

    render(): React.Element {
        return (
            <div className="Page">
                <div className="Page-header">
                    <HeaderBar />
                </div>

                <div className="Page-body">
                    <NavBar />
                </div>

                <div className="Page-footer">
                    <Footer />
                </div>
            </div>
        );
    }

}

export default HomePage;
