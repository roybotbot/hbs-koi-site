import { describe, expect, it } from 'vitest';
import { displayValue } from '../../src/lib/content/displayValue';

describe('displayValue', () => {
  it('preserves confirmed values', () => expect(displayValue('Kohaku')).toBe('Kohaku'));
  it('renders missing values as Unknown', () => expect(displayValue(null)).toBe('Unknown'));
  it('accepts an explicit fallback', () => expect(displayValue(undefined, 'Unconfirmed')).toBe('Unconfirmed'));
});
