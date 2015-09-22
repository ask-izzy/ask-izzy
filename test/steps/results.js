/* @flow */
/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import _ from "underscore";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { documentReady } from "./browser";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .then("I should see the results\n$table",
              unpromisify(seeTheResults))
        .then("I should see an info box in position $NUM",
              unpromisify(seeAnInfobox))
        .then("the info box should contain\n$lines",
              unpromisify(checkInfobox))
        .then('I should see a hotline in position $NUM which says "$STRING"',
              unpromisify(hotlinePositionAndText))
        .then('I should see "$STRING" before first hotline',
              unpromisify(assertHotlineHeading))
        ;
})();

async function seeTheResults(table: Array<Object>): Promise<void> {
    await this.driver.wait(documentReady(this.driver), 10000);

    var getText = element => element.getText();

    for (var key of _.keys(table[0])) {
        var class_ = key.match(/[(](.*)[)]/)[1];

        var expected = _.pluck(table, key);
        var actual = await Promise.all((
            await this.driver.findElements(By.css(`.${class_}`))
        )
            .map(getText)
        );

        // replace single hyphen with an empty string (to represent
        // an empty line)
        expected = expected.map(text => text == "(nada)" ? "" : text);

        assert.deepEqual(actual, expected,
                         `${key} is not correct`);

    }
}

async function seeAnInfobox(position: number): Promise<void> {
    var elements = await this.driver.findElements(
        By.css(".ResultListItem, .Infobox")
    );

    var classes = await Promise.all(elements.map(
        element => element.getAttribute("class")
    ));

    var infoboxes = classes.map(
        class_ => _.contains(class_.split(" "), "Infobox")
    );

    assert.equal(_.indexOf(infoboxes, true) + 1, position);
}

async function checkInfobox(lines: Array<string>): Promise<void> {
    var text = await this.driver.findElement(By.css(".Infobox"))
        .getText();

    assert.equal(text, lines.join("\n"));
}

async function hotlinePositionAndText(
    expectedPos: number,
    expectedText: string,
): Promise<void> {
    var elements = await this.driver.findElements(
            By.css(".CrisisLineItem, .ResultListItem, .Infobox")
        );
    var crisisLine = elements[expectedPos - 1];

    assert.equal(await crisisLine.getAttribute("class"),
                 "CrisisLineItem");

    var phone = await crisisLine.findElement(By.css(".Phone"));

    assert.equal(await phone.getText(), expectedText);
}

async function assertHotlineHeading(text: string): Promise<void> {
    var elements = await this.driver.findElements(
        By.css(".CrisisLineItem, .CrisisHeader")
    );

    var classes = [
        await elements[0].getAttribute("class"),
        await elements[1].getAttribute("class"),
    ];

    assert.deepEqual(classes, ["CrisisHeader", "CrisisLineItem"]);
    assert.equal(await elements[0].getText(), text);
}
