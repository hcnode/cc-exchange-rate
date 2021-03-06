import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {
  getRecord,
  getFieldValue,
  getFieldDisplayValue,
  updateRecord
} from "lightning/uiRecordApi";
import AMOUNT_FIELD from "@salesforce/schema/Opportunity.Amount";
import CRYPTOCURRENCYCODE_FIELD from "@salesforce/schema/Opportunity.CryptocurrencyCode__c";
import ID_FIELD from "@salesforce/schema/Opportunity.Id";
/**
 * lightning web component
 */
export default class CcExchangeRates extends LightningElement {
  @api recordId;
  @track amount;
  @track displayAmount;
  @track toCurrencyAmount;
  @track toCurrencyValue = "";
  @track options = [];
  @track conversionData;
  @track showExchangeOption = false;
  /**
   * get record
   * @param {*} param0
   */
  @wire(getRecord, {
    recordId: "$recordId",
    fields: [AMOUNT_FIELD, CRYPTOCURRENCYCODE_FIELD]
  })
  async getOpportunity({ error, data }) {
    if (data) {
      this.displayAmount = getFieldDisplayValue(data, AMOUNT_FIELD);
      this.amount = getFieldValue(data, AMOUNT_FIELD);
      this.toCurrencyValue = getFieldValue(data, CRYPTOCURRENCYCODE_FIELD);
      await this.getCurrencyOptions();
      this.handleCurrencyConversion();
    } else {
      console.log("~~~ERROR IN CcExchangeRates.js:~~~ " + error);
    }
  }
  /**
   * combobox changed event
   * @param {*} event
   */
  handleToCurrencyChange(event) {
    this.toCurrencyValue = event.detail.value;
    this.handleCurrencyConversion();
  }
  /**
   * calculate the amount in cryptocurrency
   */
  calculate() {
    const exchangeRate = this.conversionData.exchangeRate;
    this.toCurrencyAmount =
      Math.round((this.amount / exchangeRate) * 1000) / 1000;
  }
  /**
   * show or hide options
   */
  handleShowExchangeOptions() {
    this.showExchangeOption = !this.showExchangeOption;
  }
  /**
   * call api
   */
  async handleCurrencyConversion() {
    try {
      if (this.toCurrencyValue) {
        const data = await fetch(
          `https://powerhack.debugs.online/getExchangeRate?toCurrency=${this.toCurrencyValue}`
        ).then((response) => {
          return response.json();
        });
        this.conversionData = data;
        this.calculate();
      }
    } catch (error) {
      console.log("callout error ===> " + JSON.stringify(error));
    }
  }
  /**
   * get options from api
   */
  async getCurrencyOptions() {
    try {
      const options = await fetch(
        `https://powerhack.debugs.online/currencyOptions`
      ).then((response) => {
        return response.json();
      });
      this.options = options;
      if (this.toCurrencyValue === "") {
        this.toCurrencyValue =
          (this.options.find((option) => option.default) || {}).value || "BTC";
      }
    } catch (error) {
      console.log("callout error ===> " + JSON.stringify(error));
    }
  }
  /**
   * save currency code to record
   */
  async handleSaveCryptoCurrencyCode() {
    const fields = {};

    try {
      fields[CRYPTOCURRENCYCODE_FIELD.fieldApiName] = this.toCurrencyValue;
      fields[ID_FIELD.fieldApiName] = this.recordId;
      const recordInput = { fields };
      updateRecord(recordInput)
        .then(() => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Opportunity updated",
              variant: "success"
            })
          );
        })
        .catch((error) => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error updated record",
              message: error.body.message,
              variant: "error"
            })
          );
        });
    } catch (error) {
      console.error(error);
    }
  }
}
