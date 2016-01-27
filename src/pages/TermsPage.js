/* @flow */
/* eslint-disable max-len */

import React from "react";
import components from "../components";

class TermsPage extends React.Component {

    render(): ReactElement {
        let history = this.props.history;

        return (
            <div className="TermsPage">
                <components.AppBar
                    title="Terms of use"
                    onBackTouchTap={history.goBack.bind(history)}
                />

                <div className="body">
                    <p><strong>Ask Izzy Application Terms of Use</strong></p>
                    <p>Thank you for accessing the Ask Izzy application (<strong>App</strong>), which is operated by Infoxchange (ABN 74 457 506 140). Access to, and use of, this App is provided strictly subject to these terms of use. By  using this App, you accept these terms of use and our <a href="https://www.infoxchange.net.au/privacy-policy">Privacy Policy</a> (collectively the <strong>App Terms</strong>). Please only use this App if you have read, understood and agree to these terms of use.</p>
                    <p><strong>Use of the App</strong></p>
                    <p>You may only use this App to locate shelter, food, health providers, and other essential services that are listed in the directory.</p>
                    <p>Subject to these App Terms, Infoxchange grants you a limited, revocable, non-transferable and non-exclusive personal licence to access and use the App for non-commercial purposes.</p>
                    <p>Except as set out in the limited licence above and except to the extent we cannot prevent you at law from doing so: (i) neither the App Content nor any portion of the App may be used, reproduced, duplicated, copied, sold, resold, distributed, published, accessed, modified, or otherwise exploited, in whole or in part or derivative works created, for any purpose without our express, prior written consent; and (ii) you must not reverse engineer, decompile, disassemble, or extract any element of and/or otherwise discover any source code, algorithms, methods or techniques embodied in the App. The source and object code of the App must not be accessed, examined or shared except as permitted by law.</p>
                    <p>Any unauthorised use by you of the App or any and/or all of our content automatically terminates the limited licences in these App Terms, without limiting any other remedy provided by applicable law or these App Terms.</p>
                    <p><strong>Scope of services</strong></p>
                    <p>This App provides a directory of services available to people experiencing or at risk of homelessness in Australia. The App should not be relied upon as a substitute for professional legal or medical advice, counselling or similar services.</p>
                    <p>Search results in Ask Izzy are intended as a guide, and are not an endorsement that the service provided is appropriate for your personal circumstances. Some services will require an assessment to ensure you are eligible to access them. You agree to make your own inquiries and assessment as to the quality and suitability of services. For more information on a service provider’s offerings and their appropriateness, you should contact the service provider directly using the contact details provided.</p>
                    <p><strong>Disclaimers</strong></p>
                    <p>As a consumer, you have certain rights under consumer protection legislation, including the Australian Consumer Law (<strong>Consumer Rights</strong>), which cannot be excluded or limited by Infoxchange. Your Consumer Rights include statutory guarantees that any services supplied to you will be provided in a timely manner and with reasonable care and skill, and will be fit for any notified purpose. Nothing in the App Terms is intended to exclude, restrict or modify your Consumer Rights.</p>
                    <p>Otherwise this App is provided on an "as is" basis.</p>
                    <p>Service providers and other organisations that are listed in the App are required to ensure that their details are kept up-to-date in the Ask Izzy database.</p>
                    <p>While every effort is made to ensure that information is accurate and current, Infoxchange cannot be held responsible for inaccuracies in the Ask Izzy database, search results or any other information contained in the App.</p>
                    <p>Links may be included in the App to third party websites or services which will allow you to connect with such sites or obtain services that are not under our control.  Infoxchange provides these links only as a convenience.  The appearance of a link does not imply Infoxchange’s endorsement, nor is Infoxchange responsible for the contents of any linked site or services.  You access them at your own risk.</p>
                    <p>To the extent that it is permitted by law to do so and subject to your Consumer Rights, Infoxchange makes no representations or warranties, express or implied whatsoever as to any matter. In particular, Infoxchange does not make any representations or warranties with respect to the accuracy, completeness or currency of the content of the App or as to availability or, performance of the App.</p>
                    <p>The contents of this App are for informational purposes only.</p>
                    <p>The service providers listed in the directory do not under any circumstances provide services for or on behalf of Infoxchange.</p>
                    <p>You agree that, to the fullest extent permitted by applicable law and subject to your Consumer Rights, Infoxchange will not be liable except to the extent due to Infoxchange’s negligence or breach of these terms  for: (i) any expenses, losses, damages, or costs suffered or incurred by you or any other person as a result of the provision or failure by the service providers to provide any services  listed in the directory; (ii) access delays to, access interruptions to, suspension of or discontinuation of the App; (iii) data non-delivery, misdelivery, corruption, destruction or other modification to the data in or through the use of the App; (iv) viruses, system failures or malfunctions which may occur in connection with your use of the App; and (v) any inaccuracies or omissions in content contained in the App.</p>
                    <p><strong>Modification of App Terms</strong></p>
                    <p>Infoxchange reserves the right to add to, change or discontinue the services, programs and information contained in, or any other aspect of, this App at any time and without liability. Please check <a href="https://askizzy.org.au/terms">https://askizzy.org.au/terms</a> regularly for changes proposed by Infoxchange to these App Terms as your continued use of this App will signify your acceptance of any proposed changed App Terms. Please discontinue use of the App if you do not agree to any changes to the App Terms.</p>
                    <p><strong>Other rights</strong></p>
                    <p>All information and content available on the App and its “look and feel”, including but not limited to trademarks, logos, service marks, text, graphics, logos, button icons, images, audio clips, data compilations and software, and the compilation and organisation of them (collectively, the <strong>App Content</strong>) is the property of Infoxchange, our affiliates, partners or licensors, and is protected by Australian and international laws, including laws governing copyrights and trademarks. All rights not expressly granted are reserved.</p>
                    <p><strong>Governing law</strong></p>
                    <p>These App Terms shall be governed by the laws of Victoria, Australia and the parties submit to the non-exclusive jurisdiction of the courts of Victoria, Australia.</p>
                </div>
            </div>
        );
    }

}

export default TermsPage;
