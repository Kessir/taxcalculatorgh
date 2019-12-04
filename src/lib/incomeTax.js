import { Decimal } from "decimal.js";
import {
  monthlyTaxRates,
  EMPLOYEE_SSNIT_RATE,
  EMPLOYER_SSNIT_RATE
} from "./rates";

const NUM_OF_MONTHS = 12;

function calculate({ gross, allowances, isAnnual, deductions }) {
  return isAnnual
    ? computeTaxes({
        grossIncome: new Decimal(gross).dividedBy(NUM_OF_MONTHS),
        allowances: new Decimal(allowances).dividedBy(NUM_OF_MONTHS),
        deductible: new Decimal(deductions).dividedBy(NUM_OF_MONTHS),
        taxRates: monthlyTaxRates
      })
    : computeTaxes({
        grossIncome: new Decimal(gross),
        allowances: new Decimal(allowances),
        deductible: new Decimal(deductions),
        taxRates: monthlyTaxRates
      });
}

function computeTaxes({ grossIncome, allowances, deductible, taxRates }) {
  let totalTax = new Decimal(0);

  const employeeSsnitContribution = grossIncome.times(EMPLOYEE_SSNIT_RATE);
  const employerSsnitContribution = grossIncome.times(EMPLOYER_SSNIT_RATE);
  const costToEmployer = grossIncome.add(employerSsnitContribution);

  const totalDeductible = employeeSsnitContribution.plus(deductible);

  let taxableRemaining = grossIncome.minus(totalDeductible).plus(allowances);

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
    .minus(employeeSsnitContribution);

  return {
    baseAmount: grossIncome.toFixed(2),
    incomeTax: totalTax.toFixed(2),
    employerSsnit: employerSsnitContribution.toFixed(2),
    costToEmployer: costToEmployer.toFixed(2),
    employeeSsnit: employeeSsnitContribution.toFixed(2),
    netIncome: netIncome.toFixed(2),
    computationBreakdown
  };
}

export { monthlyTaxRates, calculate, computeTaxes };
