import type {ReactElement} from "react";
import React from "react";

type Props = {
    expl: any,
}

class DebugQueryScore extends React.Component<Props, void> {
    render(): ReactElement<"div"> {
        const {expl} = this.props;

        if (!expl) {
            return <div className="DebugQueryScore" />
        }

        return (
            <div className="DebugQueryScore">
                <span className="description">{expl.description}</span>
                <span className="score">{expl.value}</span>
                {(expl.details || []).map(
                    (child, index) => (
                        <DebugQueryScore
                            expl={child}
                            key={index}
                        />
                    )
                )}
            </div>
        );
    }
}

export default DebugQueryScore;
