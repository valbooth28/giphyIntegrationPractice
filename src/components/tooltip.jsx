import React from "react";
import ReactTooltip from "react-tooltip";

const Tooltip = props => {
  const { imgAltText, imgUrl, error, position } = props;
  let content;
  if (imgUrl) {
    content = <img src={imgUrl} alt={imgAltText} />;
  } else {
    // TODO - styling
    content = error;
  }
  return (
    // ENHANCEMENT: stop the tooltip from following the mouse
    <ReactTooltip place="bottom" overridePosition={position}>
      {content}
    </ReactTooltip>
  );
};

{
  /* TODO - proptypes */
}
export default Tooltip;
