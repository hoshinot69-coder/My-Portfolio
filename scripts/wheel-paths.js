function pt(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function ring(cx, cy, ro, ri, a0, a1) {
  const [x0, y0] = pt(cx, cy, ro, a0);
  const [x1, y1] = pt(cx, cy, ro, a1);
  const [x2, y2] = pt(cx, cy, ri, a1);
  const [x3, y3] = pt(cx, cy, ri, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${ro} ${ro} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${ri} ${ri} 0 ${large} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z`;
}

function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

// 0° = top, clockwise. Four 90° quadrants.
console.log('intro', ring(200, 200, 150, 98, 315, 405));
console.log('portfolio', ring(200, 200, 150, 98, 45, 135));
console.log('pop', ring(200, 200, 178, 150, 45, 135));
console.log('solutions', ring(200, 200, 150, 98, 135, 225));
console.log('journey', ring(200, 200, 150, 98, 225, 315));
console.log('path-intro', arcPath(200, 200, 124, 328, 392));
console.log('path-portfolio', arcPath(200, 200, 128, 58, 122));
console.log('path-solutions', arcPath(200, 200, 124, 212, 148));
console.log('path-journey', arcPath(200, 200, 124, 302, 238));
