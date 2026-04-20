import type { GraphicObject, LayerProcess } from '../types';

function attr(node: Element, name: string, fallback = '') {
  return node.getAttribute(name) ?? fallback;
}

function num(value: string, fallback: number) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function importSvgToObjects(svgText: string, baseProcess: LayerProcess): GraphicObject[] {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const nodes = Array.from(doc.querySelectorAll('rect, ellipse, circle, path'));

  return nodes.map((node, index) => {
    const id = `svg-${Date.now()}-${index}`;
    const name = `${node.tagName.toUpperCase()} ${index + 1}`;

    if (node.tagName === 'rect') {
      return {
        id,
        name,
        kind: 'rect',
        x: num(attr(node, 'x'), 0),
        y: num(attr(node, 'y'), 0),
        width: Math.max(1, num(attr(node, 'width'), 40)),
        height: Math.max(1, num(attr(node, 'height'), 40)),
        rotation: 0,
        process: { ...baseProcess }
      } satisfies GraphicObject;
    }

    if (node.tagName === 'ellipse' || node.tagName === 'circle') {
      const rx = node.tagName === 'circle' ? num(attr(node, 'r'), 30) : num(attr(node, 'rx'), 30);
      const ry = node.tagName === 'circle' ? num(attr(node, 'r'), 30) : num(attr(node, 'ry'), 30);
      const cx = num(attr(node, 'cx'), rx);
      const cy = num(attr(node, 'cy'), ry);
      return {
        id,
        name,
        kind: 'ellipse',
        x: cx - rx,
        y: cy - ry,
        width: Math.max(1, rx * 2),
        height: Math.max(1, ry * 2),
        rotation: 0,
        process: { ...baseProcess }
      } satisfies GraphicObject;
    }

    const d = attr(node, 'd');
    const bounds = estimatePathBounds(d);
    return {
      id,
      name,
      kind: 'path',
      x: bounds.x,
      y: bounds.y,
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      rotation: 0,
      pathData: d,
      process: { ...baseProcess }
    } satisfies GraphicObject;
  });
}

export function estimatePathBounds(pathData: string) {
  const points = parseSimplePath(pathData);
  if (points.length === 0) return { x: 0, y: 0, width: 120, height: 80 };
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function parseSimplePath(pathData: string): [number, number][] {
  const tokens = (pathData.match(/[MLHVZmlhvz]|-?\d*\.?\d+/g) ?? []).slice();
  const points: [number, number][] = [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[MLHVZmlhvz]$/.test(token)) {
      cmd = token;
      i += 1;
      if (cmd === 'Z' || cmd === 'z') {
        x = startX;
        y = startY;
        points.push([x, y]);
      }
      continue;
    }

    if (cmd === 'M' || cmd === 'L') {
      x = Number(tokens[i]);
      y = Number(tokens[i + 1]);
      if (cmd === 'M') {
        startX = x;
        startY = y;
      }
      points.push([x, y]);
      i += 2;
      continue;
    }

    if (cmd === 'm' || cmd === 'l') {
      x += Number(tokens[i]);
      y += Number(tokens[i + 1]);
      if (cmd === 'm') {
        startX = x;
        startY = y;
      }
      points.push([x, y]);
      i += 2;
      continue;
    }

    if (cmd === 'H') {
      x = Number(tokens[i]);
      points.push([x, y]);
      i += 1;
      continue;
    }

    if (cmd === 'h') {
      x += Number(tokens[i]);
      points.push([x, y]);
      i += 1;
      continue;
    }

    if (cmd === 'V') {
      y = Number(tokens[i]);
      points.push([x, y]);
      i += 1;
      continue;
    }

    if (cmd === 'v') {
      y += Number(tokens[i]);
      points.push([x, y]);
      i += 1;
      continue;
    }

    i += 1;
  }

  return points;
}
