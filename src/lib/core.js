import { Decimal } from "decimal.js";
import { monthlyTaxRates, SSNIT_RATE } from "./rates";

const NUM_OF_MONTHS = 12;

function calculate(
  grossInput,
  allowancesInput,
  taxReliefInput,
  isAnnual = false
) {
  const grossIncome = isAnnual
    ? new Decimal(grossInput).dividedBy(NUM_OF_MONTHS)
    : new Decimal(grossInput);
  const allowances = isAnnual
    ? new Decimal(allowancesInput).dividedBy(NUM_OF_MONTHS)
    : new Decimal(allowancesInput);
  const taxRelief = isAnnual
    ? new Decimal(taxReliefInput).dividedBy(NUM_OF_MONTHS)
    : new Decimal(taxReliefInput);

  return computeTaxes({
    grossIncome,
    allowances,
    taxRelief,
    taxRates: monthlyTaxRates.rates
  });
}

function computeTaxes({ grossIncome, allowances, taxRelief, taxRates }) {
  let totalTax = new Decimal(0);

  const ssnitContribution = new Decimal(grossIncome)
    .times(SSNIT_RATE)
    .dividedBy(100);

  const totalTaxRelief = ssnitContribution.plus(taxRelief);

  let taxableRemaining = new Decimal(grossIncome)
    .minus(totalTaxRelief)
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
