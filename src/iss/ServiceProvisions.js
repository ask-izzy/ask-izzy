/* @flow */

import _ from "underscore";

function escapeRegex(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

class Form {
    match(input: string): boolean {
        return true;
    }
}

class RegexpForm extends Form {
    form: RegExp;
    ignoreReferrals: boolean;

    constructor(regex: RegExp|string) {
        super();
        this.form = new RegExp(regex, "i");
    }

    match(input: string) {
        if (this.ignoreReferrals) {
            // Remove any mention of referrals to other services
            // if we aren't looking for referrals
            input = input.replace(/referrals?[^.]*/gi, "");
        }

        return this.form.test(input);
    }
}

class Keywords extends RegexpForm {

    constructor(...forms: Array<string|RegExp>) {
        /* a regular expression matching things that appear on word
         * boundaries
         * FIXME: requires consecutive keywords to have 2 spaces between
         */
        const wordTerminator = /(?:^|$|[\s,;"])/
            .source;

        /* a regular expression of all the keywords, surrounded by word
         * terminators. And in the order given. */
        let joinedForm = forms
            .map(form => {
                if (form instanceof RegExp) {
                    form = form.source
                        /* normalise space */
                        .replace(/\s+/g, "\\s+");

                    /* wrap the regex in a group to avoid regex leaking out */
                    form = `(?:${form})`;
                } else {
                    form = escapeRegex(form)
                        /* normalise strings to the hyphen or non-hyphen
                         * version */
                        .replace(/\\-/g, "[- ]")
                        /* normalise space */
                        .replace(/\s+/g, "\\s+");
                }

                return `${wordTerminator}${form}${wordTerminator}`;
            }
            )
            .join("[^.]*");

        super(joinedForm);

        this.ignoreReferrals = !forms.includes(referralsRegexp)
    }

    match(input: string) {
        input = input
            /* FIXME: This is a hack to handle the fact that word tokenizing
             * regex needs two spaces between consecutive terms */
            .replace(/\s+/g, "  ")
            /* And that a keyword at the send of a sentence needs a word
             * breaker before the fullstop -- we don't add full-stop as a word
             * break because it's already a sentence break */
            .replace(/\./g, " . ");

        return super.match(input);
    }
}

export function keywords(...args: Array<string|RegExp>): Keywords {
    return new Keywords(...args);
}

class ListForm extends Form {
    forms: Array<Form>;

    constructor(...forms: Array<Form|string|RegExp>) {
        super();
        this.forms = forms.map(form => {
            if (form instanceof Form) {
                return form;
            } else if (form instanceof RegExp) {
                return new RegexpForm(form);
            } else {
                return keywords(form);
            }
        });
    }
}

class AnyOf extends ListForm {
    match(input: string) {
        return _.some(this.forms, form => form.match(input));
    }
}

export function anyOf(...forms: Array<Form|string|RegExp>): AnyOf {
    return new AnyOf(...forms);
}

class AllOf extends ListForm {
    match(input: string) {
        return _.every(this.forms, form => form.match(input));
    }
}

export function allOf(...forms: Array<Form|string|RegExp>): AllOf {
    return new AllOf(...forms);
}

class Not extends AnyOf {
    match(input: string) {
        return !super.match(input);
    }
}

export function not(...forms: Array<Form|string|RegExp>): Not {
    return new Not(...forms);
}

/**
 * ServiceProvision aka provides:
 *
 * A single service provision, which has a display name and a representation
 * to match.
 *
 * The representation can be a form object, string or regular expression.
 * See anyOf, allOf, not and keywords.
 */
export class ServiceProvision {
    /* The display name */
    name: string;
    /* Form to match */
    form: Form;

    constructor(props: {
        name: string,
        form: Form|string|RegExp;
    }) {
        this.name = props.name;

        if (props.form instanceof Form) {
            this.form = props.form;
        } else {
            this.form = anyOf(props.form);
        }
    }

    match(input: string): boolean {
        return this.form.match(input);
    }
}

export function provides(props: {
    name: string,
    form: Form|string|RegExp,
}): ServiceProvision {
    return new ServiceProvision(props);
}

export const referralsRegexp = /referrals?/gi;
