import { LightningElement, api, wire, track } from "lwc";
import {
  getRecord,
  getFieldValue,
  getFieldDisplayValue
} from "lightning/uiRecordApi";
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
      this.handleCurrencyConversion();
    } else {
      console.log("~~~ERROR IN CcExchangeRates.js:~~~ " + error);
    }
  }

  @track toCurrencyValue = "BTC";
  @track toCurrencyValueConfirm = "BTC";
  @track options = options;
  @track defaultCurrency = "BTC";
  @track conversionData;
  @track showExchangeOption = false;
  handleToCurrencyChange(event) {
    this.toCurrencyValue = event.detail.value;
  }

  calculate() {
    const exchangeRate = this.conversionData.exchangeRate;
    this.toCurrencyAmount =
      Math.round((this.amount / exchangeRate) * 1000) / 1000;
  }
  handleShowExchangeOptions() {
    this.showExchangeOption = !this.showExchangeOption;
  }
  async handleCurrencyConversion() {
    try {
      const data = await fetch(
        `https://powerhack.debugs.online/getExchangeRate?toCurrency=${this.toCurrencyValue}`
      ).then((response) => {
        return response.json();
      });
      this.conversionData = data;
      this.calculate();
      this.toCurrencyValueConfirm = this.toCurrencyValue;
    } catch (error) {
      console.log("callout error ===> " + JSON.stringify(error));
    }
  }
}
