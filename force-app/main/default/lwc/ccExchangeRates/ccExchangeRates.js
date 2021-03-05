import { LightningElement, api, wire, track } from "lwc";
import { getRecord, getFieldValue, getFieldDisplayValue } from "lightning/uiRecordApi";
import AMOUNT_FIELD from "@salesforce/schema/Opportunity.Amount";

// Currency options
const options = [
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
  { label: "DOGE", value: "DOGE" }
];
export default class CcExchangeRates extends LightningElement {
  @api recordId;
  @track amount;
  @track displayAmount;
  @track toCurrencyAmount;
  @wire(getRecord, { recordId: "$recordId", fields: [AMOUNT_FIELD] })
  getOpportunity({ error, data }) {
    if (data) {
      this.displayAmount = getFieldDisplayValue(data, AMOUNT_FIELD);
      this.amount = getFieldValue(data, AMOUNT_FIELD);
      this.handleCurrencyConversion()
      // this.amount = JSON.stringify(data)
    } else {
      console.log("~~~ERROR IN ContactComponent.js:~~~ " + error);
    }
  }

  @track toCurrencyValue = 'BTC';
  @track toCurrencyValueConfirm = 'BTC';
  @track options = options;
  @track defaultCurrency = 'BTC';
  @track conversionData;
  @track showExchangeOption = false;
  // Getting Base currency value
  handleToCurrencyChange(event) {
    this.toCurrencyValue = event.detail.value;
  }
  
  calculate(){
    const exchangeRate = this.conversionData.exchangeRate;
    this.toCurrencyAmount = Math.round(this.amount / exchangeRate * 1000) / 1000;
  }
  handleShowExchangeOptions(){
    this.showExchangeOption = !this.showExchangeOption;
  }
  // Making Callout using Fetch
  handleCurrencyConversion() {
     fetch(
      "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
        this.toCurrencyValue +
        "&to_currency=USD&apikey=V0ZRFUZI7YQGGLXB", // End point URL
      {
        // Request type
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then((response) => {
        return response.json(); // returning the response in the form of JSON
      })
      .then((jsonResponse) => {
        let objData = {
          toCurrencyCode : '',
          toCurrencyName : '',
          exchangeRate: 1
        };

        window.console.log("jsonResponse ===> " + JSON.stringify(jsonResponse));
        // retriving the response data
        let exchangeData = jsonResponse["Realtime Currency Exchange Rate"];

        // adding data object
        objData.toCurrencyCode = exchangeData["1. From_Currency Code"];
        objData.toCurrencyName = exchangeData["2. From_Currency Name"];
        objData.exchangeRate = exchangeData["5. Exchange Rate"];

        // adding data object to show in UI
        this.conversionData = objData;
        this.calculate();
        this.toCurrencyValueConfirm = this.toCurrencyValue;
      })
      .catch((error) => {
        window.console.log("callout error ===> " + JSON.stringify(error));
      });
  }
}
