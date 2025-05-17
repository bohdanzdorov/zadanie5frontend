// src/components/MathText.jsx
import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export const MathText = ({ text }) => {
    // full block
    if (text.startsWith("$$") && text.endsWith("$$")) {
        return <BlockMath math={text.slice(2, -2)} />;
    }

    // inline pieces
    const parts = text.split(/(\$[^$]+\$)/g);
    return (
        <>
            {parts.map((part, idx) =>
                part.match(/^\$[^$]+\$$/) ? (
                    <InlineMath key={idx} math={part.slice(1, -1)} />
                ) : (
                    <React.Fragment key={idx}>{part}</React.Fragment>
                )
            )}
        </>
    );
};
