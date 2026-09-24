const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Parsed by hand rather than with Date/Intl so the output is identical at build time (SSG)
// and in every browser, regardless of timezone or ICU data.
function parseIsoDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  const [year, month, day] = match ? match.slice(1).map(Number) : [];
  if (!match || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Expected an ISO date (YYYY-MM-DD), got ${JSON.stringify(isoDate)}`);
  }
  return { year, month, day };
}

function formatMonthYear(isoDate) {
  const { year, month } = parseIsoDate(isoDate);
  return `${MONTHS[month - 1]} ${year}`;
}

function formatLongDate(isoDate) {
  const { year, month, day } = parseIsoDate(isoDate);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export { formatMonthYear, formatLongDate };
