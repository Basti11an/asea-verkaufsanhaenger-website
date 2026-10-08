import { describe, expect, it } from 'vitest';
import { de } from './de';
import { en } from './en';
import { sk } from './sk';

describe('translation dictionaries', () => {
  it('contains every German key in English and Slovak', () => {
    const keys = Object.keys(de);

    expect(Object.keys(en)).toHaveLength(keys.length);
    expect(Object.keys(sk)).toHaveLength(keys.length);

    for (const key of keys) {
      expect(en).toHaveProperty(key);
      expect(sk).toHaveProperty(key);
    }
  });
});
