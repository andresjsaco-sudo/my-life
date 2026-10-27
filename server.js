const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

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
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ── Data ──────────────────────────────────────────────────────────────────────
// The five stages of a sensing system. Every project is tagged with the stages
// it covers; the hero diagram filters the project list by stage.
const stages = [
  { key: 'sense', name: 'Sense', detail: 'IR, NTC, cameras' },
  { key: 'compute', name: 'Compute', detail: 'ESP32, Raspberry Pi' },
  { key: 'link', name: 'Link', detail: 'Antennas, LTE, ESP-NOW' },
  { key: 'cloud', name: 'Cloud', detail: 'AWS Lambda, IoT Core' },
  { key: 'interface', name: 'Interface', detail: 'React, Electron' },
];

const data = {
  name: 'Juan Andrés Betancourt',
  role: 'Electronic Engineering student',
  location: 'Barranquilla, Colombia',
  github: 'https://github.com/andresjsaco-sudo',
  githubHandle: 'github.com/andresjsaco-sudo',

  credentials: [
    {
      term: 'Graduating 2027',
      desc: 'B.Sc. Electronic Engineering, Universidad del Norte',
    },
    {
      term: 'Saber Pro, 99th percentile',
      desc: 'Colombia\'s national exit exam for university students',
    },
    {
      term: 'Four US summers',
      desc: 'Camp leadership in New Jersey, up to Assistant Director',
    },
  ],

  projects: [
    {
      featured: true,
      year: '2026',
      context: 'Final degree project',
      title: 'Early corrosion detection for steel plates',
      description: `An industrial monitoring system that detects early corrosion on galvanized and pre-painted
        steel before it is visible to an inspector. Plates are photographed under a fixed capture protocol
        inside ASTM B117 salt spray chambers; images land in S3, a serverless inference function runs a
        YOLOv8 segmentation model through ONNX Runtime, and results feed a React dashboard with a per-plate
        map of the plant.`,
      stack: ['YOLOv8-seg', 'ONNX Runtime', 'AWS CDK', 'Lambda', 'S3', 'DynamoDB', 'Cognito', 'API Gateway', 'React', 'Vite'],
      stages: ['sense', 'cloud', 'interface'],
      links: [
        { label: 'Dashboard code', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-dashboard' },
        { label: 'AWS infrastructure', url: 'https://github.com/andresjsaco-sudo/corrosion-detection-infra' },
      ],
    },
    {
      context: 'Communications Lab, Universidad del Norte',
      title: 'Classroom occupancy with edge AI and a 3D point cloud',
      description: `Real-time person detection and localization in university classrooms. A Raspberry Pi 4 runs
        YOLOv8 Nano on-device at 6 to 10 FPS and sends detection coordinates over LTE (SIMCOM A7670SA) with
        MQTT over TLS to AWS IoT Core. Lambda and DynamoDB feed a Next.js dashboard and a Potree point cloud
        viewer with about 300 ms end-to-end latency.`,
      stack: ['YOLOv8 Nano', 'Raspberry Pi 4', 'LTE', 'MQTT/TLS', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'AWS CDK', 'Next.js', 'Potree'],
      stages: ['sense', 'compute', 'link', 'cloud', 'interface'],
      links: [
        { label: 'Live dashboard', url: 'https://sensordashboardiot.vercel.app' },
        { label: 'Code', url: 'https://github.com/andresjsaco-sudo/iot-dashboard' },
      ],
    },
    {
      context: 'Microcontrollers final project',
      title: 'Aria, a glove-teleoperated robotic hand',
      description: `A five-finger robotic hand that copies the wearer's finger movements wirelessly. An ESP32-S3 in
        the glove reads one IR sensor per finger and sends finger states over ESP-NOW with under 10 ms of latency.
        On the hand, an ESP32 drives five HS-645MG servos through a PCA9685 PWM driver, calibrated for an
        accurate 50 Hz output. A button switches the hand into a rock-paper-scissors game mode.`,
      stack: ['ESP32-S3', 'ESP32', 'ESP-NOW', 'PCA9685', 'I2C', 'Arduino Core 3.x', 'C++'],
      stages: ['sense', 'compute', 'link'],
      links: [
        { label: 'Documentation and schematics', url: 'https://github.com/andresjsaco-sudo/aria-robotic-hand' },
      ],
    },
    {
      year: '2026',
      context: 'Telematics course',
      title: 'UrbanTrack, GPS vehicle tracking on AWS',
      description: `A GPS tracking web app with live and historical views of a vehicle's route. Separate writer and
        reader services run on EC2 behind a VPC peering link, with PostgreSQL on RDS and a static frontend
        served by Express.`,
      stack: ['AWS EC2', 'RDS PostgreSQL', 'VPC Peering', 'Node.js', 'Express', 'JavaScript'],
      stages: ['link', 'cloud', 'interface'],
      links: [
        { label: 'Team repository', url: 'https://github.com/DarwinDiaz07/urbanTrack' },
      ],
    },
    {
      year: '2026',
      context: 'Cellular Communications course',
      status: 'In progress',
      title: 'LTE network design for two localities of Bogotá',
      description: `Coverage dimensioning of an LTE network for the urban area of San Cristóbal and Usme, 47.68 km²
        across 12 zoning units. Downlink and uplink link budgets for band 2 (1900 MHz FDD, 20 MHz) with the
        COST-231 Hata model give an uplink-limited cell radius of 561 m, which leads to 78 three-sector eNBs on a
        hexagonal grid with 842 m between sites, covering 97.4% of the area. Each site is specified with Ericsson
        baseband and radio units and CommScope antennas, and delivered as a Google Earth KML. Capacity
        dimensioning comes next.`,
      stack: ['LTE', 'Link budget', 'COST-231 Hata', 'RF planning', 'Python', 'KML', 'LaTeX', 'Leaflet'],
      stages: ['link'],
      links: [
        { label: 'Interactive map', url: '/lte/' },
        { label: 'Report (PDF, Spanish)', url: '/lte/LTE_coverage_report_ES.pdf' },
        { label: 'Code and data', url: 'https://github.com/andresjsaco-sudo/lte-network-design' },
      ],
    },
    {
      year: '2026',
      context: 'Research with Universidad del Norte',
      status: 'Paper in preparation',
      title: 'Pyramidal horn antenna for the microwave band',
      description: `Design and simulation of a pyramidal horn antenna. A Python tool computes the horn's physical
        dimensions from the operating frequency (1 to 20 GHz) and target gain (10 to 30 dB); the design is
        simulated in CST Microwave Studio for radiation pattern and return loss, with validation planned in an
        anechoic chamber. Written up as the paper "Diseño y simulación de una antena corneta piramidal para
        aplicaciones en la banda de las microondas".`,
      stack: ['Python', 'CST Microwave Studio', 'Antenna theory', 'Microwave measurements'],
      stages: ['link'],
      links: [],
    },
    {
      context: 'Microcontrollers course',
      title: 'Zentro, a handheld arcade on ESP32-S3',
      description: `A pocket arcade console running a custom Asteroids clone on an ESP32-S3 with 8 MB of PSRAM and a
        3.2 inch ILI9341 display over SPI. Includes an animated vector-style title screen, joystick and button
        input, and a non-blocking audio queue that plays music and sound effects without stalling the game loop.`,
      stack: ['ESP32-S3', 'ILI9341', 'SPI', 'C++', 'Arduino Core 3.x'],
      stages: ['compute', 'interface'],
      links: [],
    },
    {
      year: '2026',
      context: 'Personal project',
      status: 'In progress',
      title: 'Jarvis and HandNav',
      description: `Jarvis is a local voice assistant for macOS: double-clap wake detection, Whisper speech-to-text,
        Gemini with a Groq fallback, a three-layer memory backed by ChromaDB, and an Electron heads-up display.
        HandNav navigates the desktop with hand gestures, using MediaPipe with a One Euro filter and a ZeroMQ
        pipeline into a transparent overlay.`,
      stack: ['Python', 'FastAPI', 'Electron', 'MediaPipe', 'ChromaDB', 'ZeroMQ', 'Node.js'],
      stages: ['sense', 'interface'],
      links: [],
    },
    {
      context: 'Automatic Control course',
      title: 'Inverted pendulum with PID and lead-lag control',
      description: `An inverted pendulum stabilized by an ESP32 running a 200 Hz PID loop from encoder feedback.
        A Python dashboard streams live telemetry, starts and stops the controller and zeroes the reference;
        lead, lag and lead-lag compensators are designed on the PC, discretized with the Tustin method and sent
        to the firmware as difference-equation coefficients.`,
      stack: ['ESP32', 'PID', 'Lead-lag compensation', 'Tustin discretization', 'Python', 'Streamlit'],
      stages: ['sense', 'compute', 'link', 'interface'],
      links: [],
    },
    {
      context: 'Measurements and Instrumentation',
      title: 'NTC temperature sensor with hardware linearization',
      description: `A precision temperature measurement chain built around an instrumentation amplifier. The
        thermistor's nonlinear response was characterized and corrected in hardware, followed by a Sallen-Key
        filter, reaching an SNR of 37.6 dB.`,
      stack: ['Instrumentation amplifier', 'Sallen-Key', 'LTspice', 'PCB design'],
      stages: ['sense'],
      links: [],
    },
    {
      context: 'Electronics III',
      title: 'An op-amp built from discrete BJTs',
      description: `A working operational amplifier designed entirely from discrete BJT transistors, then used as
        the analog front end of a temperature and humidity sensor.`,
      stack: ['BJT design', 'Analog circuits', 'Sensor interface'],
      stages: ['sense'],
      links: [],
    },
  ],

  experience: [
    {
      period: '2023 to 2026',
      title: 'Kiddie Keep Well Camp',
      org: 'Edison, New Jersey, USA',
      progression: 'Counselor, Head Counselor, Program Director, Assistant Director',
      desc: `Four summers at a nonprofit residential camp for children from low-income families, promoted each
        year. As Program Director I designed and ran the activity curriculum for every age group and led the
        counselor team; as Assistant Director I joined the camp's senior leadership.`,
    },
    {
      period: '2026',
      title: 'Editor and co-author, horn antenna paper',
      org: 'Universidad del Norte, Prof. Lacides Ripoll',
      desc: 'Design and simulation of a pyramidal horn antenna for the microwave band. In preparation for publication.',
    },
    {
      period: '2022 to 2024',
      title: 'IEEE Robotics and Automation Society',
      org: 'Universidad del Norte student chapter',
      progression: 'Vice President, then President',
      desc: `Grew the chapter from about 4 to 40 members by organizing technical workshops, invited talks and
        student projects in robotics and automation.`,
    },
  ],

  skills: [
    { group: 'Hardware and analog', items: 'Op-amps and instrumentation amplifiers, signal conditioning, active filters, PCB design, KiCad, LTspice, Proteus, SkyWater 130 nm PDK' },
    { group: 'Embedded', items: 'ESP32 and ESP32-S3, Raspberry Pi 4, Arduino Core 3.x, C, C++, SPI, I2C, PWM, ADC, ESP-NOW, BLE' },
    { group: 'IoT and cloud', items: 'AWS IoT Core, Lambda, DynamoDB, S3, Cognito, API Gateway, EC2, RDS, AWS CDK, MQTT over TLS, LTE modems' },
    { group: 'Vision and ML', items: 'YOLOv8, ONNX Runtime, OpenCV, MediaPipe, TensorFlow Lite' },
    { group: 'Software', items: 'Python, JavaScript, TypeScript, React, Next.js, Node.js, Express, SQL, Git, Linux, Docker' },
    { group: 'Spoken languages', items: 'Spanish (native), English (B2), French (B1), Portuguese (A2), Turkish (A1)' },
  ],

  certifications: [
    { title: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy' },
  ],

  contact: {
    email: 'andresjsaco@gmail.com',
    linkedin: 'https://www.linkedin.com/in/andresjsaco',
    linkedinHandle: 'linkedin.com/in/andresjsaco',
  },
};

// Precompute per-project stage markers for the templates.
data.stages = stages;
data.projects = data.projects.map((p) => ({
  ...p,
  stageList: p.stages.join(' '),
  stageMarks: stages.map((s) => ({ name: s.name, on: p.stages.includes(s.key) })),
  stageNames: stages.filter((s) => p.stages.includes(s.key)).map((s) => s.name).join(', '),
}));
data.projectCount = data.projects.length;
data.year = new Date().getFullYear();

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', data);
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
  });
}

module.exports = app;
