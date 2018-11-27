import { Decimal } from "decimal.js";
import { SSNIT_RATE, monthlyTaxRates } from "./rates";

const NUM_OF_MONTHS = 12;

function calculate(gross, allowances, isAnnual = false) {
  var result = isAnnual
    ? computeTaxes(
        new Decimal(gross).dividedBy(NUM_OF_MONTHS),
        new Decimal(allowances).dividedBy(NUM_OF_MONTHS),
        monthlyTaxRates
      )
    : computeTaxes(
        new Decimal(gross),
        new Decimal(allowances),
        monthlyTaxRates
      );
  return result;
}

function computeTaxes(grossIncome, allowances, taxRates) {
  let totalTax = new Decimal(0);
  const ssnitContribution = new Decimal(grossIncome)
    .times(SSNIT_RATE)
    .dividedBy(100);
  let taxableRemaining = new Decimal(grossIncome)
    .minus(ssnitContribution)
    .plus(allowances);

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

      const trancheTax = new Decimal(taxRate)
        .times(actualTaxableAmount)
        .dividedBy(100);

      totalTax = totalTax.plus(trancheTax);

      computationBreakdown[i] = {
        taxRate,
        taxAmount: trancheTax.toFixed(2),
        amountTaxed: actualTaxableAmount.toFixed(0)
      };

      taxableRemaining = taxableRemaining.minus(actualTaxableAmount);
    }
  }

  const netIncome = grossIncome
    .plus(allowances)
    .minus(totalTax)
    .minus(ssnitContribution);

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

function isPositive(val) {
  if (val === "") return false;
  return isPositiveNumber(val);
}

export {
  isPositive,
  monthlyTaxRates,
  calculate,
  isPositiveNumber,
  computeTaxes
};
