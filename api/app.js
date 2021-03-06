const config = require("./config");
const service = require('./service')
const express = require("express");
const app = express();
const port = 3005;
/**
 * router for get currency options
 */
app.get("/currencyOptions", (req, res) => {
  res.json(config.currencyOptions);
});
/**
 * router for get exchange rate
 */
app.get("/getExchangeRate", async (req, res) => {
  const toCurrency = req.query.toCurrency;
  const data = await service.getExchangeRate(toCurrency, config)
  res.json(data);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
