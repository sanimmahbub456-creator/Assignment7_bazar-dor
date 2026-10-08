export function toBengaliNumber(value: number | string): string {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";

  return String(value).replace(
    /\d/g,
    (digit) => bengaliDigits[Number(digit)]
  );
}

export function formatPrice(value: number): string {
  return toBengaliNumber(
    new Intl.NumberFormat("en-US").format(value)
  );
}

export function formatChange(value: number): string {
  const absValue = Math.abs(value).toFixed(1);

  return toBengaliNumber(absValue);
}