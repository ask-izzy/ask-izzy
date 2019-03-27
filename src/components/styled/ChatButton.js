/* @flow */

import styled from "styled-components";

const brandPaneAltDark = "#4d13af";

const buttonSize = "80px";
const buttonColor = "#ffffff";

const ChatButton = styled.button`
    width: ${buttonSize};
    height: ${buttonSize};
    margin: 0 auto;
    border-radius: 50%;
    background-color: ${brandPaneAltDark};
    color: ${buttonColor};
    line-height: ${buttonSize};
    text-align: center;

    &:not(:first-of-type) {
        margin-left: 15px;
    }
`;

export default ChatButton;
