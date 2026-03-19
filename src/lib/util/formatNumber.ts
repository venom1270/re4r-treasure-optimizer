export function formatNumber(num: number, locale = 'en-US', decimals = 0) {
    return num.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }