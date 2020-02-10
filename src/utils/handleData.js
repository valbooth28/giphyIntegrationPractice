const GIPHY_KEY = "DpTwKAohMQSPHjBeBmScaQwqsAsnWa8h";
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search";

/**
 *  Utility file for data fetching.
 *
 **/
module.exports = {
  /**
   * Make the GET request to the Giphy API
   * @param {String} searchWord
   * @returns {Object} response.json
   */
  async getData(searchWord) {
    // ENHANCMENT: retrieve different Gif even if keyword is reselected
    const requestInfo = {
      api_key: GIPHY_KEY,
      q: searchWord,
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
  },

  /**
   * Extract the relevent information out of the data
   * @param {Object} response
   * @returns {Object} resultData
   * @example {
   *  imgUrl: https://media1.giphy.com/media/33OrjzUFwkwEg/100.gif?cid=dfgfdgdf&rid=100.gif
   *  imgAltText: "Dancing Cat",
   *  error: undefined
   * }
   */
  handleResponse(response) {
    let resultData = {};
    const status = response.meta.status;
    if (status === 200) {
      // We're only displaying only one result - can access the first index
      const result = response.data[0];
      // Note: this is the url for that actually ends in .gif, and is guaranteed to be a small size
      resultData.imgUrl = result.images.fixed_height_small.url;
      resultData.imgAltText = result.title;
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
      resultData.error = errorText;
    }
    return resultData;
  }
};
