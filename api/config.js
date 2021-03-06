module.exports = {
  // currency options
  currencyOptions: [
    { label: "BTC", value: "BTC", default: true },
    { label: "ETH", value: "ETH" },
    { label: "DOGE", value: "DOGE" }
  ],
  // cache expire seconds
  cacheExpireSecond: 3,
  // exchange rate api list
  apis: [
    {
      id: 1,
      url:
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=USD&apikey=V0ZRFUZI7YQGGLXB",
      enable: true,
      format: (data) => {
        const exchangeData = data["Realtime Currency Exchange Rate"];
        const toCurrencyCode = exchangeData["1. From_Currency Code"];
        const toCurrencyName = exchangeData["2. From_Currency Name"];
        const exchangeRate = exchangeData["5. Exchange Rate"];
        return {
          toCurrencyCode,
          toCurrencyName,
          exchangeRate
        };
      }
    },
    {
      id: 2,
      url: "https://api.coingecko.com/api/v3/exchange_rates",
      enable: true,
      format: (data, toCurrency) => {
        const btcToUsd = data.rates.usd;
        const btcToCurrency = data.rates[toCurrency.toLowerCase()];
        if (!btcToUsd || !btcToCurrency) {
          throw new Error("btcToUsd or btcToCurrency not found");
        }
        return {
          toCurrencyCode: btcToCurrency.unit,
          toCurrencyName: btcToCurrency.name,
          exchangeRate: btcToUsd.value / btcToCurrency.value
        };
      }
    }
  ]
};
