const config = require("./config");
const axios = require('axios').default;
const express = require("express");
const app = express();
const port = 3005;

app.get("/currencyOptions", (req, res) => {
  res.json(config.currencyOptions);
});

app.get("/getExchangeRate", async (req, res) => {
  const toCurrency = req.query.toCurrency;
  const api = config.apis[0];
  try {
    const response = await axios.get(api.url.replace('${fromCurrency}', toCurrency));
    res.json(api.format(response.data));
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
