module.exports = {
  currencyOptions: [
    { label: "BTC", value: "BTC" },
    { label: "ETH", value: "ETH" },
    { label: "DOGE", value: "DOGE" }
  ],
  apis: [
    {
      url:
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=USD&apikey=V0ZRFUZI7YQGGLXB",
      enable: true,
      format: (data) => {
        let exchangeData = data["Realtime Currency Exchange Rate"];
        const toCurrencyCode = exchangeData["1. From_Currency Code"];
        const toCurrencyName = exchangeData["2. From_Currency Name"];
        const exchangeRate = exchangeData["5. Exchange Rate"];
        return {
          toCurrencyCode,
          toCurrencyName,
          exchangeRate
        };
      }
    }
  ]
};
