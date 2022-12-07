import React from "react";

type Props = {
    expl: Record<string, any>,
}

function DebugQueryScore({
    expl,
}: Props) {
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
                ),
            )}
        </div>
    )
}

export default DebugQueryScore;
