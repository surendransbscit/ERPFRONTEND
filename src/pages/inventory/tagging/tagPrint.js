import React from "react";
import TagPrintTemplateOne from "./tagPrintTemplate/tagPrintTemplateOne";
import TagPrintTemplateTwo from "./tagPrintTemplate/tagPrintTemplateTwo";


const TagPrint = (details) => {
    return (
        <>
        { details.settings.tag_print_template == 1 && ( <TagPrintTemplateOne itemDetails= {details.itemDetails} settings={details.settings}  user={details.user} /> )}
        { details.settings.tag_print_template == 2 && ( <TagPrintTemplateTwo itemDetails= {details.itemDetails} settings={details.settings} user={details.user} /> )}

        </>
    );
};

export default TagPrint;
