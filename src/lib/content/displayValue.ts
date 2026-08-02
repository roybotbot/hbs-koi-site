export function displayValue(
  value: string | number | null | undefined,
  fallback = 'Unknown',
): string {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}
