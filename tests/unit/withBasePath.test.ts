import { describe, expect, it } from 'vitest';
import { withBasePath } from '../../src/lib/content/withBasePath';

describe('withBasePath', () => {
  it.each([
    ['/', '/chapel-koi-site/'],
    ['/fish', '/chapel-koi-site/fish'],
    ['/fish/specimen-01', '/chapel-koi-site/fish/specimen-01'],
    ['/history#sources', '/chapel-koi-site/history#sources'],
  ])('prefixes %s with the project base', (path, expected) => {
    expect(withBasePath(path, '/chapel-koi-site/')).toBe(expected);
  });

  it('keeps local root-based paths unchanged', () => {
    expect(withBasePath('/fish', '/')).toBe('/fish');
  });
});
