const { promisify } = require("util");
const axios = require("axios").default;
const redis = require("redis");
const client = redis.createClient();
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const expire = promisify(client.expire).bind(client);

client.on("error", function (error) {
  console.error(error);
});

async function saveRateToCache(key, value, config) {
  await set(key, value);
  await expire(key, config.cacheExpireSecond);
}
function getRateFromCache(key) {
  return get(key);
}

async function getExchangeRate(toCurrency, config) {
  const cacheData = await getRateFromCache(toCurrency);
  if (cacheData) {
    return JSON.parse(cacheData);
  }
  const data = await callApi(toCurrency, config);
  await saveRateToCache(toCurrency, JSON.stringify(data), config);
  return data;
}

async function callApi(toCurrency, config) {
  for (api of config.apis) {
    try {
      if(api.enable){
        const response = await axios.get(
          api.url.replace("${fromCurrency}", toCurrency)
        );
        return {
          ...api.format(response.data, toCurrency),
          updatedAt: new Date().toISOString(),
          id: api.id
        };
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  getExchangeRate,
  getRateFromCache,
  client
};
