import React, { Component } from "react";
import { getData, handleResponse } from "./utils/handleData";
import Tooltip from "./components/Tooltip";
import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchWord: null,
      showTooltip: false,
      imgAltText: null,
      imgUrl: null,
      error: null
    };
    // binding used as opposed to extra babel class property transpilation
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleClick = this.handleClick.bind(this);

    document.addEventListener("mouseup", this.handleClick);
  }

  /**
   * Handle click event throughout the page. If the user clicks while tooltip is
   * open, hide it, otherwise, set off the chain of events to trigger
   * a rerender with a new ToolTip
   * @param {Event} event
   */
  handleClick(event) {
    if (!this.state.showTooltip) {
      const selectedText = window.getSelection().toString();
      if (selectedText.length) {
        // Note: ensure the searchWord state has been set before trying to access it for a request
        this.setState(
          {
            searchWord: selectedText
          },
          async () => {
            const data = await getData(selectedText);
            const parsedData = handleResponse(data);
            this.setState({ ...this.state, showTooltip: true, ...parsedData });
          }
        );
      }
      // if empty space is selected- ignore
    } else {
      this.toggleTooltip();
    }
  }

  /**
   * Reset the state to trigger a rerender without the tooltip
   * @return {void}
   */
  toggleTooltip() {
    this.setState({
      // stop showing the modal
      showTooltip: false,
      // clear out old giphy data
      searchWord: null,
      imgAltTex: null,
      imgUrl: null,
      // optimistically reset error every time
      error: null
    });
  }

  render() {
    const { showTooltip, imgAltText, imgUrl, error } = this.state;
    console.log();
    return (
      <div className="App">
        <h1>GiphyTooltip demo</h1>
        {/* ENHANCEMENT: Allow the user to enter their own text */}
        <p data-tip>
          Just select the text and get GIFs!
          <br />
          Cats😺, dogs🐶, and unicorns🦄!
        </p>
        {showTooltip && (
          <Tooltip imgAltText={imgAltText} imgUrl={imgUrl} error={error} />
        )}
      </div>
    );
  }
}

export default App;
