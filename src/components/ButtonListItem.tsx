import type {ReactNode} from "react";
import React from "react";

import ListItem from "./ListItem";
import type {Props as ListItemProps} from "./ListItem";
import Button from "./base/Button";

type PropsRest = {onClick: Function}

type Props = Omit<ListItemProps<typeof Button>, keyof PropsRest & {rootElement: any}> & PropsRest



export default class ButtonListItem extends React.Component<Props> {
    render(): ReactNode {
        return <>
            <ListItem
                {...this.props}
                rootElement={Button}
                onClick={this.onClick.bind(this)}
            />
        </>
    }

    onClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
        event.preventDefault();
    }
}
