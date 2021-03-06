const service = require("./service");
const config = require("./config");
afterAll((done) => {
  service.client.end(true);
  done();
});
function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
test("Get Exchange Rate first time", async () => {
  const result = await service.getExchangeRate("BTC", config);
  expect(result.toCurrencyCode).toBe("BTC");
  expect(result).toHaveProperty("toCurrencyName");
  expect(result.exchangeRate).not.toBeNaN();
  expect(result).toHaveProperty("updatedAt");
});

test("Data exists in cache", async () => {
  const result = await service.getRateFromCache("BTC");
  expect(result).toBeTruthy();
});

test("Get data from cache before expire", async () => {
  await sleep(2000);
  const result = await service.getExchangeRate("BTC", config);
  expect(new Date(result.updatedAt).valueOf()).toBeLessThan(
    new Date().valueOf() - 2000
  );
});

test("Data does not exist in cache", async () => {
  await sleep(1000);
  const result = await service.getRateFromCache("BTC");
  expect(result).toBeFalsy();
});

test("Use different api when fetch error", async () => {
  const result = await service.getExchangeRate("BTC", {
    ...config,
    apis: [
      {
        ...config.apis[0],
        url : 'http://notexistsdomain.com'
      },
      config.apis[1]
    ]
  });
  expect(result.toCurrencyCode).toBe("BTC");
  expect(result).toHaveProperty("toCurrencyName");
  expect(result.exchangeRate).not.toBeNaN();
  expect(result).toHaveProperty("updatedAt");
});


test("api enable is false", async () => {
  const result = await service.getExchangeRate("BTC", {
    ...config,
    apis: [
      {
        ...config.apis[0],
        enable: false
      },
      config.apis[1]
    ]
  });
  expect(result.id).toBe(2);
});



