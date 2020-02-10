import React, { Component } from "react";
import Tooltip from "./components/tooltip";
import "./styles.css";

const GIPHY_KEY = "DpTwKAohMQSPHjBeBmScaQwqsAsnWa8h";
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search";

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchWord: null,
      showTooltip: false,
      imgAltText: null,
      imgUrl: null,
      error: null,
      position: null
    };
    // binding used as opposed to extra babel class property transpilation
    this.getGif = this.getGif.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleClick = this.handleClick.bind(this);

    document.addEventListener("mouseup", this.handleClick);
  }

  handleClick(event) {
    if (!this.state.showTooltip) {
      const selectedText = window.getSelection().toString();
      if (selectedText.length) {
        // Note: ensure the searchWord state has been set before trying to access it for a request
        this.setState(
          {
            searchWord: selectedText,
            position: [event.clientX, event.clientY]
          },
          async () => {
            const data = await this.getGif();
            this.handleResponse(data);
          }
        );
      }
      // if empty space is selected- ignore
    } else {
      this.toggleTooltip();
    }
  }

  async getGif() {
    // ENHANCMENT: retrieve different Gif even if keyword is reselected
    const requestInfo = {
      api_key: GIPHY_KEY,
      q: this.state.searchWord,
      limit: 1, //no need to fetch more data than we need for the tooltip
      rating: "g"
    };
    // snippet courtesy of https://stackoverflow.com/a/42078312
    const query = Object.keys(requestInfo)
      .map(
        k => encodeURIComponent(k) + "=" + encodeURIComponent(requestInfo[k])
      )
      .join("&");

    const response = await fetch(`${GIPHY_URL}?${query}`);
    return await response.json();
  }

  handleResponse(response) {
    let newState = {
      showTooltip: true
    };
    const status = response.meta.status;
    if (status === 200) {
      // Only one result - can access the first index
      const result = response.data[0];
      // Note: this is the url that actually ends in .gif
      newState.imgUrl = result.images.fixed_height_small.url;
      newState.imgAltText = result.title;
    } else {
      let errorText;
      switch (status) {
        case 404:
          errorText =
            "Unable to find a gif matching that keyword. Please make another selction.";
          break;

        case 403:
          // ENHANCEMENT: production error logging to indicate likely error w/API key
          errorText =
            "We're having trouble retrieving gifs right now- please visit the tooltip later.";
          break;

        case 429:
          // ENHANCEMENT: production warning logging to indicate we might need to upgrade our API tier
          errorText =
            "We're having trouble retrieving gifs right now- please wait a moment, and try again";
          break;

        default:
          errorText =
            "We're having troule retrieving a gif for that keyword. Please make another selection, or come back later.";
          break;
      }
      newState.error = errorText;
    }
    this.setState({ ...this.state, ...newState });
  }

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
    return (
      <div className="App">
        <h1>GiphyTooltip demo</h1>
        <p data-tip>
          Just select the text and get GIFs!
          <br />
          {/* TODO - accessible emojis */}
          Cats😺, dogs🐶, and unicorns🦄!
        </p>
        {showTooltip && (
          <Tooltip
            onClickEvent={this.toggleTooltip}
            imgAltText={imgAltText}
            imgUrl={imgUrl}
            error={error}
          />
        )}
      </div>
    );
  }
}

export default App;
