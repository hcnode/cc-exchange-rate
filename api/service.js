/**
 * service of api
 */
const { promisify } = require("util");
const axios = require("axios").default;
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL || "");
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const expire = promisify(client.expire).bind(client);

client.on("error", function (error) {
  console.error(error);
});
/**
 * Save rate data to cache
 * @param {*} key
 * @param {*} value
 * @param {*} config
 */
async function saveRateToCache(key, value, config) {
  await set(key, value);
  await expire(key, config.cacheExpireSecond);
}
/**
 * get data from cache
 * @param {*} key
 * @returns
 */
function getRateFromCache(key) {
  return get(key);
}
/**
 * get rate, try to get from cache, or from api
 * @param {*} toCurrency
 * @param {*} config
 * @returns
 */
async function getExchangeRate(toCurrency, config) {
  const cacheData = await getRateFromCache(toCurrency);
  if (cacheData) {
    return JSON.parse(cacheData);
  }
  const data = await callApi(toCurrency, config);
  await saveRateToCache(toCurrency, JSON.stringify(data), config);
  return data;
}
/**
 * call external api
 * @param {*} toCurrency
 * @param {*} config
 * @returns
 */
async function callApi(toCurrency, config) {
  for (api of config.apis) {
    try {
      if (api.enable) {
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
