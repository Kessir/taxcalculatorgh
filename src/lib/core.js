import { Decimal } from "decimal.js";
import { monthlyTaxRates, SSNIT_RATE } from "./rates";

function calculate(grossInput, allowancesInput, taxReliefInput) {
  if (grossInput === "") {
    grossInput = 0;
  }
  if (allowancesInput === "") {
    allowancesInput = 0;
  }
  if (taxReliefInput === "") {
    taxReliefInput = 0;
  }

  if (!isValidNumber(grossInput) || !isValidNumber(allowancesInput) || !isValidNumber(taxReliefInput)) {
    return { errorMessage: "Please input valid amounts" };
  }

  return computeTaxes({
    grossIncome: new Decimal(grossInput),
    allowances: new Decimal(allowancesInput),
    taxRelief: new Decimal(taxReliefInput),
    taxRates: monthlyTaxRates.rates
  });
}

function computeTaxes({ grossIncome, allowances, taxRelief, taxRates }) {

  let totalTax = new Decimal(0);
  const ssnitContribution = new Decimal(grossIncome).times(SSNIT_RATE).dividedBy(100);

  const totalTaxRelief = ssnitContribution.plus(taxRelief);

  let taxableRemaining = new Decimal(grossIncome).minus(totalTaxRelief).plus(allowances);

  const computationBreakdown = [
    {
      taxRate: 0,
      taxAmount: 0,
      amountTaxed: 0
    }
  ];

  for (let i = 0; i < taxRates.length; i++) {
    if (taxableRemaining.gt(0)) {
      const [taxRate, taxableAmount] = taxRates[i];
      const actualTaxableAmount = taxableRemaining.gt(taxableAmount)
        ? new Decimal(taxableAmount)
        : taxableRemaining;

      const trancheTax = new Decimal(taxRate).times(actualTaxableAmount).dividedBy(100);

      totalTax = totalTax.plus(trancheTax);

      computationBreakdown[i] = {
        taxRate,
        taxAmount: trancheTax.toFixed(2),
        amountTaxed: actualTaxableAmount.toFixed(0)
      };

      taxableRemaining = taxableRemaining.minus(actualTaxableAmount);
    }
  }

  const netIncome = grossIncome.plus(allowances).minus(totalTax).minus(ssnitContribution);

  return {
    incomeTax: totalTax.toFixed(2),
    ssnit: ssnitContribution.toFixed(2),
    netIncome: netIncome.toFixed(2),
    computationBreakdown
  };
}

function isPositiveNumber(number) {
  const positiveNumberRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;
  return positiveNumberRegex.test(number);
}

function isValidNumber(val) {
  if (val === "") return false;
  return isPositiveNumber(val);
}

export { monthlyTaxRates, calculate };
