import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const Tooltip = props => {
  const { imgAltText, imgUrl, error } = props;
  let content;
  if (imgUrl && imgUrl.length) {
    content = <img src={imgUrl} alt={imgAltText} />;
  } else {
    // ENHANCEMENT: style the error
    content = error;
  }
  return (
    // ENHANCEMENT: stop the tooltip from following the mouse by using overridePosition prop
    <ReactTooltip place="bottom">{content}</ReactTooltip>
  );
};

Tooltip.propTypes = {
  imgAltText: PropTypes.string,
  imgUrl: PropTypes.string,
  error: PropTypes.string
};
Tooltip.defaultProps = {
  imgAltText: "",
  imgUrl: "",
  error: ""
};
export default Tooltip;
