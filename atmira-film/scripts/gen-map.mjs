// Pre-computes a dot-matrix world map (equal-earth projection) with Europe / LatAm tagged.
// Output: src/data/worldDots.json  — { w, h, step, dots: [[x, y, tag]], anchors }
import { readFileSync, writeFileSync } from "node:fs";
import { geoEqualEarth, geoContains } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const countries = feature(topo, topo.objects.countries).features;

const EUROPE = new Set(["Spain","Portugal","France","Germany","Italy","United Kingdom","Ireland","Netherlands","Belgium","Switzerland","Austria","Poland","Czechia","Slovakia","Hungary","Romania","Bulgaria","Greece","Serbia","Croatia","Bosnia and Herz.","Slovenia","Albania","North Macedonia","Montenegro","Kosovo","Denmark","Norway","Sweden","Finland","Estonia","Latvia","Lithuania","Belarus","Ukraine","Moldova","Luxembourg","Iceland"]);
const LATAM = new Set(["Mexico","Guatemala","Belize","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Colombia","Venezuela","Guyana","Suriname","Ecuador","Peru","Brazil","Bolivia","Paraguay","Chile","Argentina","Uruguay","Cuba","Dominican Rep.","Haiti"]);

const W = 1920, H = 1000;
const projection = geoEqualEarth().fitExtent([[0, 0], [W, H]], { type: "Sphere" });
const tagOf = new Map();
for (const c of countries) {
  const n = c.properties.name;
  tagOf.set(c, EUROPE.has(n) ? 1 : LATAM.has(n) ? 2 : 0);
}

const step = 11;
const dots = [];
for (let row = 0, y = step / 2; y < H; row++, y += step * 0.866) {
  for (let x = (row % 2 ? step / 2 : 0) + step / 2; x < W; x += step) {
    const ll = projection.invert([x, y]);
    if (!ll || !isFinite(ll[0]) || !isFinite(ll[1])) continue;
    let tag = -1;
    for (const c of countries) {
      if (geoContains(c, ll)) { tag = tagOf.get(c); break; }
    }
    if (tag < 0) continue;
    if (ll[1] < -58) continue; // trim Antarctica
    dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10, tag]);
  }
}
const p = (lon, lat) => projection([lon, lat]).map((v) => Math.round(v));
const anchors = {
  europe: p(-3.7, 44),
  latam: p(-62, -12),
  // arc end-points (region level, no city claims)
  europeNodes: [p(-3.7, 40.4), p(2.3, 48.8), p(12.5, 41.9), p(-9.1, 38.7), p(13.4, 52.5)],
  latamNodes: [p(-99, 19.4), p(-74, 4.7), p(-77, -12), p(-70.6, -33.4), p(-46.6, -23.5), p(-58.4, -34.6)],
};
writeFileSync("src/data/worldDots.json", JSON.stringify({ w: W, h: H, step, dots, anchors }));
const counts = [0, 0, 0];
dots.forEach((d) => counts[d[2]]++);
console.log("dots", dots.length, "other/europe/latam", counts, anchors);
