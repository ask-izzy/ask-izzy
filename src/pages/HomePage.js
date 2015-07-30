import React from "react";
import Router, {RouteHandler} from 'react-router';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import mui from "material-ui";

class HomePage extends React.Component {

    render(): React.Element {
        return (
            <div className="Page">
                <div className="Page-header">
                    <mui.AppBar
                        showMenuIconButton={false}
                        title="Ask Izzy"
                    />
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
