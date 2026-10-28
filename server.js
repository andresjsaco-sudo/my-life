const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const lte = require('./lib/lte');
const ICONS = require('./lib/icon-data.json');

// Technology label -> icon slug (Simple Icons, CC0).
const ICON_FOR = {
  'Python': 'python', 'KML': 'googleearth', 'Leaflet': 'leaflet', 'ONNX Runtime': 'onnx', 'AWS CDK': 'amazonwebservices',
  'Lambda': 'awslambda', 'S3': 'amazons3', 'DynamoDB': 'amazondynamodb', 'Cognito': 'amazoncognito', 'React': 'react',
  'Raspberry Pi 4': 'raspberrypi', 'MQTT/TLS': 'mqtt', 'AWS IoT Core': 'amazonwebservices', 'Next.js': 'nextdotjs',
  'ESP32-S3': 'espressif', 'ESP32': 'espressif', 'C++': 'cplusplus', 'AWS EC2': 'amazonec2', 'RDS PostgreSQL': 'postgresql',
  'Node.js': 'nodedotjs', 'Express': 'express', 'Streamlit': 'streamlit', 'FastAPI': 'fastapi', 'Electron': 'electron',
  'MediaPipe': 'mediapipe', 'LaTeX': 'latex', 'GitHub': 'github',
};

function iconSvg(slug, cls) {
  const i = ICONS[slug];
  if (!i) return '';
  return `<svg class="${cls || 'ti'}" viewBox="0 0 24 24" aria-hidden="true"><path fill="${i.color}" d="${i.path}"/></svg>`;
}

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
    icon: (slug, cls) => new (require('handlebars').SafeString)(iconSvg(slug, typeof cls === 'string' ? cls : '')),
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
// Cache-busting version for CSS and JS: changes on every deploy.
const ASSET_VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36)).slice(0, 8);
app.use((req, res, next) => { res.locals.v = ASSET_VERSION; next(); });
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

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

const areas = [
  { key: 'embedded', label: 'Embedded' },
  { key: 'rf', label: 'RF and telecom' },
  { key: 'cloud', label: 'Cloud and IoT' },
  { key: 'vision', label: 'Vision and ML' },
  { key: 'control', label: 'Control' },
  { key: 'analog', label: 'Analog' },
];

const SLUGS = ['lte', 'corrosion', 'classroom-occupancy', 'aria', 'urbantrack', 'horn-antenna', 'inverted-pendulum', 'zentro', 'jarvis', 'ntc-sensor', 'bjt-op-amp'];
const SUMMARIES = {
  urbantrack: 'Live and historical vehicle routes from EC2 services sharing PostgreSQL on RDS.',
  'horn-antenna': 'A Python sizing tool for horn antennas from 1 to 20 GHz, validated in CST.',
  'inverted-pendulum': 'A 200 Hz PID loop on an ESP32 with lead-lag compensators designed on the PC.',
  zentro: 'A pocket Asteroids console on an ESP32-S3 with a 3.2 inch SPI display.',
  jarvis: 'A local voice assistant for macOS and desktop navigation with hand gestures.',
  'ntc-sensor': 'A thermistor measurement chain linearized in hardware, 37.6 dB SNR.',
  'bjt-op-amp': 'A working op-amp from discrete transistors, used as a sensor front end.',
};

// Every project. `featured` ones appear on the home page.
const projects = [
  {
    featured: true,
    year: '2026',
    status: 'In progress',
    context: 'Cellular Systems course',
    title: 'LTE network design for two localities of Bogotá',
    summary: 'Coverage dimensioning in band 2 for 47.68 km², from the link budget to 78 sites placed on the map.',
    description: 'Coverage dimensioning of an LTE network for the urban area of San Cristóbal and Usme, 47.68 km² across 12 zoning units. Downlink and uplink link budgets for band 2 (1900 MHz FDD, 20 MHz) with the COST-231 Hata model give an uplink-limited cell radius of 561 m, which leads to 78 three-sector eNBs on a hexagonal grid with 842 m between sites, covering 97.4% of the area. Capacity dimensioning comes next.',
    specs: [{ k: 'sites', v: '78' }, { k: 'cell radius', v: '561 m' }, { k: 'coverage', v: '97.4%' }],
    stack: ['LTE', 'Link budget', 'COST-231 Hata', 'Python', 'KML', 'Leaflet'],
    areas: ['rf'],
    caseStudy: '/projects/lte',
    links: [
      { label: 'Case study', url: '/projects/lte' },
      { label: 'Code and data', url: 'https://github.com/andresjsaco-sudo/lte-network-design' },
    ],
  },
  {
    featured: true,
    year: '2026',
    context: 'Final degree project',
    title: 'Early corrosion detection for steel plates',
    summary: 'YOLOv8 segmentation in a serverless AWS backend, with a dashboard that maps every plate in the plant.',
    description: 'An industrial monitoring system that detects early corrosion on galvanized and pre-painted steel before it is visible to an inspector. Plates are photographed under a fixed capture protocol inside ASTM B117 salt spray chambers; images land in S3, a serverless inference function runs a YOLOv8 segmentation model through ONNX Runtime, and results feed a React dashboard with a per-plate map of the plant.',
    specs: [{ k: 'model', v: 'YOLOv8' }, { k: 'images', v: '~32k' }, { k: 'lambdas', v: '6' }],
    stack: ['YOLOv8-seg', 'ONNX Runtime', 'AWS CDK', 'Lambda', 'S3', 'DynamoDB', 'Cognito', 'React'],
    areas: ['vision', 'cloud'],
    links: [
      { label: 'Dashboard code', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-dashboard' },
      { label: 'Infrastructure', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-infra' },
    ],
  },
  {
    featured: true,
    year: '2025',
    context: 'Communications Lab, Universidad del Norte',
    title: 'Classroom occupancy with edge AI',
    summary: 'On-device person detection on a Raspberry Pi 4, reported over LTE and MQTT/TLS to AWS IoT Core and a 3D point cloud.',
    description: 'Real-time person detection and localization in university classrooms. A Raspberry Pi 4 runs YOLOv8 Nano on-device at 6 to 10 FPS and sends detection coordinates over LTE (SIMCOM A7670SA) with MQTT over TLS to AWS IoT Core. Lambda and DynamoDB feed a Next.js dashboard and a Potree point cloud viewer with about 300 ms of latency.',
    specs: [{ k: 'on-device', v: '6-10 fps' }, { k: 'latency', v: '~300 ms' }, { k: 'link', v: 'LTE' }],
    stack: ['YOLOv8 Nano', 'Raspberry Pi 4', 'LTE', 'MQTT/TLS', 'AWS IoT Core', 'Lambda', 'Next.js'],
    areas: ['vision', 'cloud', 'embedded', 'rf'],
    links: [
      { label: 'Live dashboard', url: 'https://sensordashboardiot.vercel.app' },
      { label: 'Code', url: 'https://github.com/andresjsaco-sudo/iot-dashboard' },
    ],
  },
  {
    featured: true,
    year: '2026',
    context: 'Microcontrollers final project',
    title: 'Aria, a glove-teleoperated robotic hand',
    summary: 'An ESP32-S3 glove reads one IR sensor per finger and drives five servos on the hand over ESP-NOW.',
    description: 'A five-finger robotic hand that copies the wearer\'s finger movements wirelessly. An ESP32-S3 in the glove reads one IR sensor per finger and sends finger states over ESP-NOW with under 10 ms of latency. On the hand, an ESP32 drives five HS-645MG servos through a PCA9685 PWM driver calibrated for an accurate 50 Hz output.',
    specs: [{ k: 'latency', v: '<10 ms' }, { k: 'servos', v: '5' }, { k: 'pwm', v: '50 Hz' }],
    stack: ['ESP32-S3', 'ESP32', 'ESP-NOW', 'PCA9685', 'I2C', 'C++'],
    areas: ['embedded'],
    links: [
      { label: 'Documentation and schematics', url: 'https://github.com/andresjsaco-sudo/aria-robotic-hand' },
    ],
  },
  {
    year: '2026',
    context: 'Telematics course',
    title: 'UrbanTrack, GPS vehicle tracking on AWS',
    description: 'A GPS tracking web app with live and historical views of a vehicle\'s route. Separate writer and reader services run on EC2 behind a VPC peering link, with PostgreSQL on RDS and a static frontend served by Express.',
    stack: ['AWS EC2', 'RDS PostgreSQL', 'VPC Peering', 'Node.js', 'Express'],
    areas: ['cloud'],
    links: [{ label: 'Repository', url: 'https://github.com/DarwinDiaz07/urbanTrack' }],
  },
  {
    year: '2026',
    status: 'Paper in preparation',
    context: 'Research, Universidad del Norte',
    title: 'Pyramidal horn antenna for the microwave band',
    description: 'A Python tool computes the horn\'s physical dimensions from the operating frequency (1 to 20 GHz) and target gain (10 to 30 dB); the design is simulated in CST Microwave Studio for radiation pattern and return loss, with validation planned in an anechoic chamber.',
    stack: ['Python', 'CST Microwave Studio', 'Antenna theory'],
    areas: ['rf'],
    links: [],
  },
  {
    context: 'Automatic Control course',
    title: 'Inverted pendulum with PID and lead-lag control',
    description: 'An inverted pendulum stabilized by an ESP32 running a 200 Hz PID loop from encoder feedback. A Python dashboard streams live telemetry; lead, lag and lead-lag compensators are designed on the PC, discretized with the Tustin method and sent to the firmware as difference-equation coefficients.',
    stack: ['ESP32', 'PID', 'Lead-lag', 'Tustin discretization', 'Python', 'Streamlit'],
    areas: ['control', 'embedded'],
    links: [],
  },
  {
    context: 'Microcontrollers course',
    title: 'Zentro, a handheld arcade on ESP32-S3',
    description: 'A pocket arcade console running a custom Asteroids clone on an ESP32-S3 with 8 MB of PSRAM and a 3.2 inch ILI9341 display over SPI, with joystick input and a non-blocking audio queue that plays music and effects without stalling the game loop.',
    stack: ['ESP32-S3', 'ILI9341', 'SPI', 'C++'],
    areas: ['embedded'],
    links: [],
  },
  {
    year: '2026',
    status: 'In progress',
    context: 'Personal project',
    title: 'Jarvis and HandNav',
    description: 'Jarvis is a local voice assistant for macOS: double-clap wake detection, Whisper speech-to-text, Gemini with a Groq fallback, a three-layer memory backed by ChromaDB and an Electron heads-up display. HandNav navigates the desktop with hand gestures, using MediaPipe with a One Euro filter.',
    stack: ['Python', 'FastAPI', 'Electron', 'MediaPipe', 'ChromaDB', 'ZeroMQ'],
    areas: ['vision'],
    links: [],
  },
  {
    context: 'Measurements and Instrumentation',
    title: 'NTC temperature sensor with hardware linearization',
    description: 'A precision temperature measurement chain built around an instrumentation amplifier. The thermistor\'s nonlinear response was characterized and corrected in hardware, followed by a Sallen-Key filter, reaching an SNR of 37.6 dB.',
    stack: ['Instrumentation amplifier', 'Sallen-Key', 'LTspice', 'PCB design'],
    areas: ['analog'],
    links: [],
  },
  {
    context: 'Electronics III',
    title: 'An op-amp built from discrete BJTs',
    description: 'A working operational amplifier designed entirely from discrete BJT transistors, then used as the analog front end of a temperature and humidity sensor.',
    stack: ['BJT design', 'Analog circuits', 'Sensor interface'],
    areas: ['analog'],
    links: [],
  },
].map((p, i) => {
  const slug = SLUGS[i];
  return {
    ...p,
    slug,
    url: `/projects/${slug}`,
    summary: p.summary || SUMMARIES[slug],
    num: String(i + 1).padStart(2, '0'),
    areaList: p.areas.join(' '),
    areaLabels: p.areas.map((k) => areas.find((a) => a.key === k).label).join(', '),
    when: [p.year, p.status].filter(Boolean).join(', '),
    tech: p.stack.map((label) => ({ label, icon: ICON_FOR[label] || null })),
    action: p.caseStudy
      ? { label: 'Read the case study', url: p.caseStudy, kind: 'case' }
      : (p.links.find((l) => l.url.includes('github.com'))
        ? { label: 'View on GitHub', url: p.links.find((l) => l.url.includes('github.com')).url, kind: 'github' }
        : (p.links[0] ? { label: 'Visit website', url: p.links[0].url, kind: 'web' } : null)),
  };
});

const featured = projects.filter((p) => p.featured);

const bio = [
  'I\'m Juan Andrés, a final-year Electronic Engineering student at Universidad del Norte in Barranquilla, Colombia. I finish coursework in December 2026 and graduate in September 2027.',
  'I like the part of engineering where hardware meets software: firmware for ESP32 and Raspberry Pi, radio links from ESP-NOW to LTE, computer vision at the edge and the cloud services that collect the data. Lately I planned an <a href="/projects/lte">LTE network for two localities of Bogotá</a> and built a <a href="/projects/corrosion">serverless corrosion detector</a> on AWS.',
  'I spent four summers at <a href="/career">a nonprofit camp in New Jersey</a>, going from counselor to Assistant Director, and I was president of the IEEE RAS student chapter at Uninorte. I speak Spanish, English and French, some Portuguese and a little Turkish, and I follow Formula 1 closely.',
]

const experience = [
  {
    period: 'Summers 2023 to 2026',
    place: 'Edison, New Jersey, USA',
    title: 'Kiddie Keep Well Camp',
    role: 'Counselor, Head Counselor, Program Director, Assistant Director',
    desc: 'Promoted every season at a nonprofit residential camp for children from low-income families. As Program Director I designed the activity curriculum for every age group and led the counselor team; as Assistant Director I joined the camp\'s senior leadership. All of it in English.',
  },
  {
    period: '2026',
    place: 'Universidad del Norte',
    title: 'Horn antenna paper',
    role: 'Editor and co-author',
    desc: 'Design and simulation of a pyramidal horn antenna for the microwave band, in preparation for publication.',
  },
  {
    period: '2022 to 2024',
    place: 'Barranquilla',
    title: 'IEEE Robotics and Automation Society, Uninorte',
    role: 'Vice President, then President',
    desc: 'Grew the student chapter from about 4 to 40 members through technical workshops, invited talks and student projects.',
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

const languages = [
  { k: 'Spanish', code: 'co' },
  { k: 'English', code: 'us' },
  { k: 'French', code: 'fr' },
  { k: 'Portuguese', code: 'br' },
  { k: 'Turkish', code: 'tr' },
];

const glance = [
  { k: 'Studying', v: 'B.Sc. Electronic Engineering, Universidad del Norte' },
  { k: 'Graduating', v: 'September 2027, coursework done December 2026' },
  { k: 'Saber Pro', v: '99th percentile nationally' },
  { k: 'Based in', v: 'Barranquilla, Colombia. Open to remote' },
  { k: 'Focus', v: 'Embedded systems, RF and telecom, cloud and IoT' },
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
    person, featured, lte, bio, skills, languages, glance,
    projectCount: projects.length,
  });
});

app.get('/projects', (req, res) => {
  res.render('projects', {
    page: 'projects',
    title: 'Projects, Juan Andrés Betancourt',
    description: 'Embedded systems, RF and telecom, cloud, computer vision, control and analog projects by Juan Andrés Betancourt.',
    canonical: `${SITE_URL}/projects`,
    person, projects, areas,
  });
});

app.get('/projects/lte', (req, res) => {
  res.render('project-lte', {
    page: 'projects',
    title: 'LTE network design for San Cristóbal and Usme, Juan Andrés Betancourt',
    description: 'Case study: coverage dimensioning of an LTE network in band 2 for two localities of Bogotá, from the link budget to 78 sites on the map.',
    canonical: `${SITE_URL}/projects/lte`,
    person, lte, ...lteCase,
  });
});

app.get('/projects/:slug', (req, res, next) => {
  const i = projects.findIndex((p) => p.slug === req.params.slug);
  if (i === -1) return next();
  const project = projects[i];
  res.render('project', {
    page: 'projects',
    title: `${project.title}, Juan Andrés Betancourt`,
    description: project.summary,
    canonical: `${SITE_URL}${project.url}`,
    person, project,
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  });
});

app.get('/career', (req, res) => {
  res.render('career', {
    page: 'career',
    title: 'Career, Juan Andrés Betancourt',
    description: 'Experience, education and languages of Juan Andrés Betancourt, electronic engineer in Barranquilla, Colombia.',
    canonical: `${SITE_URL}/career`,
    person, experience, languages,
  });
});

app.get('/about', (req, res) => res.redirect(301, '/'));

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page not found, Juan Andrés Betancourt',
    description: 'This page does not exist.',
    hideContact: true,
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
