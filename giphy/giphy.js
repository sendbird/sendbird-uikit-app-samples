require("dotenv").config();
const axios = require("axios");

class Giphy {
  async fetchSearchResults(searchedInput) {
    let data = [];
    const results = await axios(`https://api.giphy.com/v1/gifs/search`, {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q: searchedInput,
      },
    });
    data = results.data.data;
    return data;
  }

  selectGiphy(giphyResults) {
    let lastGiphySeen = {};
    let randomizedNumber = Math.floor(Math.random() * 26);
    let giphySelected = giphyResults[randomizedNumber];
    if (lastGiphySeen === giphySelected) {
      giphySelected = giphyResults[Math.floor(Math.random() * 26)];
    }
    lastGiphySeen = giphySelected;
    return giphySelected;
  }

}
module.exports = Giphy;