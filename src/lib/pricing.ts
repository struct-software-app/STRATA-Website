import { TOKEN_USD_RATE } from '../config';

export function tokensToUsd(tokens: number): number {
  return tokens * TOKEN_USD_RATE;
}

export function formatUsd(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

export function normalizePeriod(period?: string | null): string {
  const cleaned = (period || 'per month').replace(/^per\s+/i, '').trim();
  return cleaned || 'month';
}
