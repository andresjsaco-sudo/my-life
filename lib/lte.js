// Geometry for the LTE network map drawn on the home page and the LTE case study.
// Reads the published GeoJSON layers once and projects them to a flat plane
// (1 km = 100 SVG units), then builds one hexagon per eNB, the three sector
// azimuths of each site and the outline of the 12 urban zoning units (UPZ).
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'lte', 'data');
const UNITS_PER_KM = 100;
const SITE_SPACING_KM = 0.842; // inter-site distance from the design
const HEX_SIDE_KM = SITE_SPACING_KM / Math.sqrt(3);
const SECTOR_TICK_KM = 0.22;
const AZIMUTHS = [36, 156, 276];
const NEIGHBOR_KM = 0.9;
const PAD_KM = 0.5;

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

function fieldFrom(desc, label) {
  const line = desc.split('\n').find((l) => l.startsWith(label + ':'));
  return line ? line.slice(label.length + 1).trim() : '';
}

function build() {
  const enb = readJson('enb.geojson').features.filter((f) => f.geometry && f.geometry.type === 'Point');
  const upz = readJson('upz.geojson').features;

  const lat0 = 4.53;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180);
  const ky = 110.57;
  const project = ([lon, lat]) => [lon * kx, -lat * ky];

  const sites = enb.map((f) => {
    const [x, y] = project(f.geometry.coordinates);
    const desc = f.properties.desc || '';
    return {
      name: f.properties.name,
      x,
      y,
      lat: f.geometry.coordinates[1].toFixed(5),
      lon: f.geometry.coordinates[0].toFixed(5),
      locality: fieldFrom(desc, 'Localidad'),
      upz: fieldFrom(desc, 'UPZ'),
    };
  });

  const rings = [];
  upz.forEach((f) => {
    const g = f.geometry;
    const polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
    polys.forEach((p) => rings.push(p[0].map(project)));
  });

  const xs = sites.map((s) => s.x).concat(...rings.map((r) => r.map((p) => p[0])));
  const ys = sites.map((s) => s.y).concat(...rings.map((r) => r.map((p) => p[1])));
  const x0 = Math.min(...xs) - PAD_KM;
  const y0 = Math.min(...ys) - PAD_KM;
  const width = Math.max(...xs) + PAD_KM - x0;
  const height = Math.max(...ys) + PAD_KM - y0;
  const u = (v) => Math.round(v * UNITS_PER_KM);
  const pt = (x, y) => `${u(x - x0)} ${u(y - y0)}`;

  // Grid orientation: angle from the first site to its nearest neighbor.
  const a = sites[0];
  const nearest = sites
    .filter((s) => s !== a)
    .reduce((best, s) => (Math.hypot(s.x - a.x, s.y - a.y) < Math.hypot(best.x - a.x, best.y - a.y) ? s : best));
  const gridDeg = (Math.atan2(nearest.y - a.y, nearest.x - a.x) * 180) / Math.PI;
  const vertexDeg = gridDeg + 30;

  let sectorPath = '';
  const cells = sites.map((s, i) => {
    const points = [];
    for (let k = 0; k < 6; k += 1) {
      const r = ((vertexDeg + 60 * k) * Math.PI) / 180;
      points.push(pt(s.x + HEX_SIDE_KM * Math.cos(r), s.y + HEX_SIDE_KM * Math.sin(r)));
    }
    AZIMUTHS.forEach((az) => {
      const r = ((az - 90) * Math.PI) / 180;
      sectorPath += `M${pt(s.x, s.y)}L${pt(s.x + SECTOR_TICK_KM * Math.cos(r), s.y + SECTOR_TICK_KM * Math.sin(r))}`;
    });
    const neighbors = sites.filter((o) => o !== s && Math.hypot(o.x - s.x, o.y - s.y) < NEIGHBOR_KM).length;
    return {
      i,
      id: s.name.replace('eNB-', ''),
      points: points.join(' '),
      cx: u(s.x - x0),
      cy: u(s.y - y0),
      lat: s.lat,
      lon: s.lon,
      locality: s.locality,
      upz: s.upz,
      neighbors,
    };
  });

  const upzPath = rings
    .map((r) => {
      const step = r.filter((_, k) => k % 4 === 0);
      return `M${step.map((p) => pt(p[0], p[1])).join('L')}Z`;
    })
    .join('');

  return {
    viewW: u(width),
    viewH: u(height),
    cells,
    sectorPath,
    upzPath,
    neighborUnits: NEIGHBOR_KM * UNITS_PER_KM,
    siteCount: cells.length,
  };
}

module.exports = build();
