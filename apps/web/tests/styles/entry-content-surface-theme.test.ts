import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const entryLayoutCss = readFileSync(
  new URL('../../src/styles/home/entry-layout.css', import.meta.url),
  'utf8',
);

/**
 * `--entry-content-surface` paints the main content card on every Home tab
 * (Home / 社区 / 全部项目 / 设计体系 / 插件). It used to be a literal
 * `rgba(255, 255, 255, 0.85)`, which has no dark counterpart: in dark mode
 * the card stayed milky white while the chrome around it went dark, and the
 * hero title rendered near-white text on that white card.
 */
function surfaceDeclarations(): string[] {
  return [...entryLayoutCss.matchAll(/--entry-content-surface:\s*([^;]+);/g)].map((match) =>
    (match[1] ?? '').trim(),
  );
}

describe('entry content card surface', () => {
  it('derives the surface from a theme token instead of a literal white', () => {
    const declarations = surfaceDeclarations();
    expect(declarations.length).toBeGreaterThan(0);

    for (const declaration of declarations) {
      expect(declaration, declaration).not.toMatch(/rgba\(\s*255\s*,\s*255\s*,\s*255/);
      expect(declaration, declaration).not.toBe('#fff');
    }
  });

  it('resolves the base surface through var(--bg) so dark mode paints a dark card', () => {
    const [base] = surfaceDeclarations();
    expect(base).toBeDefined();
    expect(base).toMatch(/var\(--bg\)/);
  });
});
