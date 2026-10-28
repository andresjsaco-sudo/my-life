const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const lte = require('./lib/lte');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = 'https://andresjsaco.vercel.app';

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://tile.openstreetmap.org'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// View engine
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b,
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ── Data ──────────────────────────────────────────────────────────────────────
const person = {
  name: 'Juan Andrés Betancourt',
  email: 'andresjsaco@gmail.com',
  linkedin: 'https://www.linkedin.com/in/andresjsaco',
  github: 'https://github.com/andresjsaco-sudo',
  cv: '/cv/CV_Juan_Andres_Betancourt_EN.pdf',
  year: new Date().getFullYear(),
};

const facts = [
  { k: 'Saber Pro', v: '99th percentile' },
  { k: 'Degree', v: 'B.Sc. EE, 2027' },
  { k: 'Projects', v: '11 built' },
  { k: 'Languages', v: 'ES, EN, FR, PT' },
];

// Featured work: shown as cards on the home page.
const featured = [
  {
    meta: '2026, in progress / Cellular Systems',
    title: 'LTE network design for two localities of Bogotá',
    summary: 'Coverage dimensioning in band 2 for 47.68 km², from the link budget to 78 sites placed on the map.',
    specs: [{ k: 'sites', v: '78' }, { k: 'cell radius', v: '561 m' }, { k: 'coverage', v: '97.4%' }],
    tags: 'RF planning, Python, KML',
    caseStudy: '/projects/lte',
  },
  {
    meta: '2026 / Final degree project',
    title: 'Early corrosion detection for steel plates',
    summary: 'YOLOv8 segmentation in a serverless AWS backend, with a dashboard that maps every plate in the plant.',
    specs: [{ k: 'model', v: 'YOLOv8' }, { k: 'images', v: '~32k' }, { k: 'lambdas', v: '6' }],
    tags: 'ML, AWS CDK, React',
    links: [
      { label: 'Dashboard code', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-dashboard' },
      { label: 'Infrastructure', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-infra' },
    ],
  },
  {
    meta: '2025 / Communications Lab',
    title: 'Classroom occupancy with edge AI',
    summary: 'On-device person detection on a Raspberry Pi 4, reported over LTE and MQTT/TLS to AWS IoT Core and a 3D point cloud.',
    specs: [{ k: 'on-device', v: '6-10 fps' }, { k: 'latency', v: '~300 ms' }, { k: 'link', v: 'LTE' }],
    tags: 'Edge AI, IoT',
    links: [
      { label: 'Live dashboard', url: 'https://sensordashboardiot.vercel.app' },
      { label: 'Code', url: 'https://github.com/andresjsaco-sudo/iot-dashboard' },
    ],
  },
  {
    meta: '2026 / Microcontrollers',
    title: 'Aria, a glove-teleoperated robotic hand',
    summary: 'An ESP32-S3 glove reads one IR sensor per finger and drives five servos on the hand over ESP-NOW.',
    specs: [{ k: 'latency', v: '<10 ms' }, { k: 'servos', v: '5' }, { k: 'pwm', v: '50 Hz' }],
    tags: 'Embedded, C++',
    links: [
      { label: 'Schematics', url: 'https://github.com/andresjsaco-sudo/aria-robotic-hand' },
    ],
  },
];

// Everything else, listed compactly.
const more = [
  { title: 'UrbanTrack, GPS vehicle tracking on AWS', tag: 'Cloud / 2026', url: 'https://github.com/DarwinDiaz07/urbanTrack' },
  { title: 'Pyramidal horn antenna, paper in preparation', tag: 'RF / 2026' },
  { title: 'Inverted pendulum with PID and lead-lag control', tag: 'Control' },
  { title: 'Zentro, a handheld arcade on ESP32-S3', tag: 'Embedded' },
  { title: 'Jarvis and HandNav, voice and gesture control', tag: 'Software / 2026' },
  { title: 'NTC temperature sensor with hardware linearization', tag: 'Analog' },
  { title: 'An op-amp built from discrete BJTs', tag: 'Analog' },
];

const experience = [
  {
    period: 'Summers 2023 to 2026, Edison, NJ',
    title: 'Kiddie Keep Well Camp, Counselor to Assistant Director',
    desc: 'Promoted every season at a nonprofit residential camp for children from low-income families. As Program Director I designed the activity curriculum and led the counselor team, working in English.',
  },
  {
    period: '2026, Universidad del Norte',
    title: 'Editor and co-author, horn antenna paper',
    desc: 'Design and simulation of a pyramidal horn antenna for the microwave band, in preparation for publication.',
  },
  {
    period: '2022 to 2024, Barranquilla',
    title: 'IEEE RAS Student Chapter, Vice President and President',
    desc: 'Grew the Uninorte chapter from about 4 to 40 members through technical workshops, invited talks and student projects.',
  },
];

const skills = [
  { k: 'Embedded', v: 'ESP32, ESP32-S3, Raspberry Pi 4, C, C++, SPI, I2C, PWM, ESP-NOW, BLE' },
  { k: 'RF and communications', v: 'LTE planning, link budgets, COST-231 Hata, antennas, CST Microwave Studio' },
  { k: 'Cloud and IoT', v: 'AWS IoT Core, Lambda, DynamoDB, S3, Cognito, API Gateway, EC2, RDS, CDK, MQTT' },
  { k: 'Software', v: 'Python, JavaScript, TypeScript, SQL, React, Next.js, Node.js, Git, Linux, Docker' },
  { k: 'Vision and ML', v: 'YOLOv8, ONNX Runtime, OpenCV, MediaPipe, TensorFlow Lite' },
  { k: 'Hardware and control', v: 'KiCad, LTspice, PCB design, PID and lead-lag control, MATLAB' },
];

const lteCase = {
  metrics: [
    { k: 'sites (eNB)', v: '78' },
    { k: 'cell radius', v: '561 m' },
    { k: 'site spacing', v: '842 m' },
    { k: 'area covered', v: '97.4%' },
    { k: 'sectors', v: '234' },
  ],
  equipment: [
    { k: 'Baseband', v: 'Ericsson Baseband 6630' },
    { k: 'Radio unit', v: 'Ericsson Radio 4438, B2/B66' },
    { k: 'Antenna', v: 'CommScope NHH-65B-R2B, 65°, 17.7 dBi' },
    { k: 'Power', v: '40 W (46 dBm) per sector' },
    { k: 'Electrical tilt', v: '7°' },
    { k: 'Azimuths', v: '36°, 156°, 276°' },
  ],
};

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', {
    page: 'home',
    title: 'Juan Andrés Betancourt, Electronic Engineer',
    description: 'Electronic engineer in Barranquilla, Colombia, working on embedded systems, wireless links and cloud. Available full time from December 2026.',
    canonical: `${SITE_URL}/`,
    person, facts, featured, more, experience, skills, lte,
    projectCount: featured.length + more.length,
  });
});

app.get('/projects/lte', (req, res) => {
  res.render('project-lte', {
    page: 'work',
    title: 'LTE network design for San Cristóbal and Usme, Juan Andrés Betancourt',
    description: 'Case study: coverage dimensioning of an LTE network in band 2 for two localities of Bogotá, from the link budget to 78 sites on the map.',
    canonical: `${SITE_URL}/projects/lte`,
    person, lte, ...lteCase,
  });
});

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page not found, Juan Andrés Betancourt',
    description: 'This page does not exist.',
    person,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
  });
}

module.exports = app;
