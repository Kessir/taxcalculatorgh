export const SSNIT_RATE = 5.5

// Effective from 01/01/2024
export const monthlyTaxRates = {
  effectiveFrom: '01/01/2024',
  rates: [
    [0, 490],
    [5, 110],
    [10, 130],
    [17.5, 3166.67],
    [25, 16000],
    [30, 30520],
    [35, Number.POSITIVE_INFINITY] // anything above GHC 50,000
  ]
}

// Effective until 01/01/2024
// export const monthlyTaxRates = {
//   effectiveFrom: '02/04/2023',
//   rates: [
//     [0, 402],
//     [5, 110],
//     [10, 130],
//     [17.5, 3000],
//     [25, 16395],
//     [30, 29963],
//     [35, Number.POSITIVE_INFINITY] // anything above GHC 50,000
//   ]
// }


// Effective until 02/04/2023
// export const monthlyTaxRates = [
//   [0, 365],
//   [5, 110],
//   [10, 130],
//   [17.5, 3000],
//   [25, 16395],
//   [30, Number.POSITIVE_INFINITY] // anything above GHC 20,000
// ];

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
