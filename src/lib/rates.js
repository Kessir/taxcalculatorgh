export const SSNIT_RATE = 5.5;

// Effective from 01/01/2022
export const monthlyTaxRates = [
  [0, 365],
  [5, 110],
  [10, 130],
  [17.5, 3000],
  [25, 16395],
  [30, Number.POSITIVE_INFINITY] // anything above GHC 20,000
];

// Effective until 31/12/2021
// export const monthlyTaxRates = [
//   [0, 319],
//   [5, 100],
//   [10, 120],
//   [17.5, 3000],
//   [25, 16461],
//   [30, Number.POSITIVE_INFINITY] // anything above GHC 20,000
// ];

// OLD
// export const monthlyTaxRates = [
//   [0, 288],
//   [5, 100],
//   [10, 140],
//   [17.5, 3000],
//   [25, 16472],
//   [30, Number.POSITIVE_INFINITY] // anything above GHC 20,000
// ];
