# Crytocurrencies Exchange rate

## features
* Show selected cryptocurrency exchange rate in REAL TIME
* Selected cryptocurrency can be saved to the context record
* Use multiple exchange rate services
* Use cache in server side

## Usages
* Create custom field `CryptocurrencyCode` for the cryptocurrency code in Opportunity Object
* In `CSP Trusted Sites` Setting, add `https://powerhack.debugs.online` to the Trusted Sites list
* In `Remote Site Settings` Setting, add `https://powerhack.debugs.online` to the Remote Site list
* Edit Opportunity Detail Page, drag `ccExchangeRates` component to the detail page, and save.

## Component Workflow
1. Component shown in the detail page, auto load exchange rate after component mounted.
![1](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/1.png "component")
1. Click `Show Exchange options`, the options dropdown and save button are shown
![2](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/2.png "component")
1. Options are fetched from server, which can be configured in the server.
![3](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/3.png "component")
1. If the currency is changed, the corresponding exchange rate will fetch immediately.
![4](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/4.png "component")
1. If `Save` button is clicked, CryptocurrencyCode field will be updated.
![5](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/5.png "component")
1. Navigate to `Detail` tab, you can see the CryptocurrencyCode field is updated as well.
![6](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/6.png "component")

## Server side
### Prerequisites
* node.js
* express
* axios
* redis

### getExchangeRate api work flow
![7](https://raw.githubusercontent.com/hcnode/cc-exchange-rate/master/screenshots/7.png "component")

### Multipule Api support
#### Why?
* Stability concern(limit access times/network issues)
* Using standard data structure.
* CORS concern

### Run/Deploy
* Depend local redis or config env `REDIS_URL`, then run `node app.js`.
* Or Run docker compose: `docker-compose up`

### Unit Test
`yarn run test`

### Improvement
