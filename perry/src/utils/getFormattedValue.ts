function getFormattedValue(value: number): string {
  if (value < 10000) {
    return value.toString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(value) / 3);

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  const formatted = scaled.toFixed(1).replace(/\.0$/, "");

  return `${formatted}${suffix}+`;
}

function getFormattedDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

export { getFormattedValue, getFormattedDate };