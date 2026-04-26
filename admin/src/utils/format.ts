export function formatVND(amount: number): string {
  // Multiply by 1000 because the database stores units of 1000 (as seen in old admin)
  const actualAmount = amount * 1000;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(actualAmount);
}

export function formatCompactNumber(number: number): string {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
}
