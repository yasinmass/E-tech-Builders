export function formatIndianCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInLakhs(amount: number) {
  if (amount >= 10000000) {
    return `(${(amount / 10000000).toFixed(2)} Crore)`;
  } else if (amount >= 100000) {
    return `(${(amount / 100000).toFixed(2)} Lakhs)`;
  } else if (amount >= 1000) {
    return `(${(amount / 1000).toFixed(2)} Thousand)`;
  }
  return "";
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero Rupees";

  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + "Hundred " + (n % 100 !== 0 ? "and " + convert(n % 100) : "");
    return "";
  }

  let words = "";
  let remaining = num;

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crore > 0) words += convert(crore) + "Crore ";

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakh > 0) words += convert(lakh) + "Lakh ";

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousand > 0) words += convert(thousand) + "Thousand ";

  if (remaining > 0) {
    if (words !== "") words += "and ";
    words += convert(remaining);
  }

  return words.trim() + " Rupees";
}
