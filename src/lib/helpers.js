import { Decimal } from "decimal.js";

const SSNIT_RATE = 5.5;
const NUM_OF_MONTHS = 12;
const monthlyTaxRates = [
  [0, 261],
  [5, 70],
  [10, 100],
  [17.5, 2810],
  [25, Number.POSITIVE_INFINITY] // anything above GHC 3,241
];

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
  console.log("result", result);
  return result;
}

function computeTaxes(gross, allowances, taxRates) {
  let totalTax = new Decimal(0);
  const ssnitContribution = new Decimal(gross).times(SSNIT_RATE).dividedBy(100);
  let taxableRemaining = new Decimal(gross)
    .minus(ssnitContribution)
    .plus(allowances);

  for (let i = 0; i < taxRates.length; i++) {
    if (taxableRemaining.gt(0)) {
      //if there's money left to be taxed
      const tranche =
        taxableRemaining > taxRates[i][1] ? taxRates[i][1] : taxableRemaining; //ternary operator
      const trancheTax = new Decimal(taxRates[i][0])
        .times(tranche)
        .dividedBy(100);

      totalTax = totalTax.plus(trancheTax);
      taxableRemaining = taxableRemaining.minus(tranche);
    }
  }
  const netIncome = gross
    .plus(allowances)
    .minus(totalTax)
    .minus(ssnitContribution);

  return {
    incomeTax: totalTax.toFixed(2),
    ssnit: ssnitContribution.toFixed(2),
    netIncome: netIncome.toFixed(2)
  };
}

function isPositiveNumber(number) {
  const positiveNumberRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;
  return positiveNumberRegex.test(number);
}

function isPostive(val) {
  if (val && val !== 0) {
    return isPositiveNumber(val);
  }
  return true;
}
export {
  isPostive,
  monthlyTaxRates,
  calculate,
  isPositiveNumber,
  computeTaxes
};
