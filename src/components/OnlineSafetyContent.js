/* @flow */
// eslint-disable max-len
import type {Node as ReactNode} from "React";

import React from "react";

import Link from "./Link";

class OnlineSafetyContent extends React.Component<{}, void> {
    render(): ReactNode {
        const linkEsafetyPage = "https://www.esafety.gov.au/key-issues/domestic-family-violence/help-support/get-help-in-your-language";
        const link1800Respect = "https://www.1800respect.org.au";

        return (
            <React.Fragment>
                <h1>
                    Online Safety Information
                </h1>

                <h2>
                    Staying Safe online
                </h2>
                <p>
                    Technology is always changing, and it is important to be
                    safe online. There are some simple steps which will make you
                    safer online, and websites with information and step by step
                    guides to help you.
                </p>

                <h2>
                    Safety on Ask Izzy – The ‘Quick Exit’ button
                </h2>
                <p>
                    A quick exit button closes the website, and takes you to a
                    safe website, as a way to hide what you were looking at if
                    someone unexpected looks over your shoulder or comes into
                    the room. If you use the quick exit button on Ask Izzy, it
                    will close Ask Izzy and open the government weather website.
                    The Quick Exit button <strong>does not delete the browser
                    history</strong>, so if someone looks in your browser they
                    can see everything you looked at on Ask Izzy.
                </p>

                <h2>
                    Internet History
                </h2>
                <p>
                    When looking at websites on the internet, your browser saves
                    the pages you look at.
                </p>
                <p>
                    You can:
                </p>
                <ul>
                    <li>
                        delete your browser history.
                    </li>
                    <li>
                        use a ‘private/secret’ view browser.
                    </li>
                </ul>
                <p>
                    To learn how go to{" "}
                    <Link to="https://www.esafety.gov.au/">
                        E-Commissioners - Australian Government
                    </Link>
                </p>

                <h2>
                    Safe Computer
                </h2>
                <p>
                    If you are worried about someone looking at your internet
                    use, then you should use a safe computer. A safe computer
                    is a computer that the person checking your phone or
                    computer couldn't use - like a friend's computer, work
                    computer or one at the library. Do not sign in to sites
                    like Gmail or Facebook as these sites can save other
                    places you look at.
                </p>

                <h2>
                    Step-by-Step Guides
                </h2>

                <p>
                    Available in 12 different languages.
                </p>

                <h3>
                    <Link to={linkEsafetyPage}>
                        eSafety Commissioner - Step-by-Step Guides
                    </Link>
                </h3>
                <p>
                    The eSafetyWomen resources aim to help women to manage
                    technology risks and abuse by giving them the tools they
                    need to be confident when online.
                </p>
                <p>
                    The resources include safety checks and step-by-step
                    guides on how to clear your browser, and make sure your
                    social media and other accounts are secure.
                </p>
                <p>
                    If you are worried a partner or family member is monitoring
                    your technology use, or tracking / following you with
                    technology call <Link to={link1800Respect}>1800Respect
                    </Link> on 1300 737 732 to get advice and a local service to
                    help.
                </p>
            </React.Fragment>
        );
    }
}

export default OnlineSafetyContent;
