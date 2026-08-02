import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const workflowPath = new URL('../../.github/workflows/deploy-pages.yml', import.meta.url);

describe('GitHub Pages workflow', () => {
  it('builds main and deploys dist with official Pages actions', async () => {
    const workflow = await readFile(workflowPath, 'utf8');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('actions/configure-pages@v5');
    expect(workflow).toContain('actions/upload-pages-artifact@v3');
    expect(workflow).toContain('actions/deploy-pages@v4');
    expect(workflow).toContain('path: dist');
    expect(workflow).toContain('SITE_URL: ${{ steps.pages.outputs.origin }}');
    expect(workflow).toContain('BASE_PATH: ${{ steps.pages.outputs.base_path }}');
  });
});
