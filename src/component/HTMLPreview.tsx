import React from "react";

interface HTMLPreviewProps {
    htmlContent: string;
}

const HTMLPreview: React.FC<HTMLPreviewProps> = ({ htmlContent }) => {
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <div dangerouslySetInnerHTML={createMarkup(htmlContent)} />
    );
};

export default HTMLPreview;