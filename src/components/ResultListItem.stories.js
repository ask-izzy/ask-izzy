import React from "react";
import ResultListItem from "./ResultListItem";
import iss from "../iss";
import fixtures from "../../fixtures/services";

export default {
    title: "Service Components/ResultListItem",
    component: ResultListItem,
    argTypes: {},
};

const Template = (args) => <div style={{backgroundColor: "#fff"}}>
    <ResultListItem {...args} />
</div>;

export const InfoxchangeExample = Template.bind({});
InfoxchangeExample.args = {
    object: new iss.Service(fixtures.ixa),
};

export const SusansHouse = Template.bind({});
SusansHouse.args = {
    object: new iss.Service(fixtures.susansHouse),
};

export const HousingService = Template.bind({});
HousingService.args = {
    object: new iss.Service(fixtures.housingService),
};

export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    object: new iss.Service(fixtures.domesticviolence),
};