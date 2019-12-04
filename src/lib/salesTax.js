import { Decimal } from "decimal.js";

import { NHIL_RATE, GETFUND_RATE, VAT_RATE } from "./rates";

export function grossToNet(inputAmount) {
  const baseAmount = new Decimal(inputAmount);
  const nhil = baseAmount.times(NHIL_RATE);
  const getfund = baseAmount.times(GETFUND_RATE);

  const totalBeforeVat = baseAmount.plus(nhil).plus(getfund);

  const vat = totalBeforeVat.times(VAT_RATE);

  const totalAmount = totalBeforeVat.plus(vat);

  return {
    vat: vat.toFixed(2),
    nhil: nhil.toFixed(2),
    getfund: getfund.toFixed(2),
    baseAmount: baseAmount.toFixed(2),
    totalBeforeVat: totalBeforeVat.toFixed(2),
    totalAmount: totalAmount.toFixed(2)
  };
}

export function netToGross(netAmount, vatInclusive = true) {
  const divisor = new Decimal(1)
    .plus(NHIL_RATE)
    .plus(GETFUND_RATE)
    .times(vatInclusive ? 1 + VAT_RATE : 1);

  const baseAmount = new Decimal(netAmount).dividedBy(divisor);
  const nhil = new Decimal(baseAmount).times(NHIL_RATE);
  const getfund = new Decimal(baseAmount).times(GETFUND_RATE);

  const totalBeforeVat = new Decimal(baseAmount).plus(nhil).plus(getfund);

  const vat = baseAmount
    .plus(nhil)
    .plus(getfund)
    .times(VAT_RATE);

  return {
    vat: vat.toFixed(2),
    nhil: nhil.toFixed(2),
    getfund: getfund.toFixed(2),
    baseAmount: baseAmount.toFixed(2),
    totalBeforeVat: totalBeforeVat.toFixed(2),
    totalAmount: netAmount
  };
}
