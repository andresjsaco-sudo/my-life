const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
const data = {
  name: 'Juan Andrés Betancourt',
  role: 'Electronic Engineer',
  location: 'Barranquilla, Colombia',
  university: 'Universidad del Norte',
  bio: [
    `I'm a final-year Electronic Engineering student at <strong>Universidad del Norte</strong> in Barranquilla, Colombia.
     My work sits at the intersection of hardware design, sensor systems, and applied machine learning —
     building devices that measure the physical world with precision and intelligence.`,
    `What sets my work apart is that I design from the ground up. I've built operational amplifiers
     from discrete <strong>BJT transistors</strong>, designed and linearized instrumentation amplifier-based
     measurement systems, and developed IoT sensor networks with computer vision. When I work on a system,
     I understand every layer of it.`,
    `Beyond engineering, I've spent three summers in New Jersey as a leader at <strong>Kiddie Keep Well Camp</strong>,
     a nonprofit serving children from low-income families — progressing from counselor to Program Director
     and, in Summer 2026, Assistant Director. Leadership that matters to me as much as the circuits.`
     `I was Vice President and later President of the IEEE RAS chapter at Uninorte, connecting students 
     to the frontier of robotics and automation. I speak Spanish natively, English fluently, and can get by in French 
     and Portuguese.`,
  ],
  tags: [
    { label: 'Instrumentation', accent: 'accent' },
    { label: 'IoT Systems', accent: 'accent' },
    { label: 'Machine Learning', accent: 'accent3' },
    { label: 'Signal Processing', accent: '' },
    { label: 'Embedded Systems', accent: '' },
    { label: 'PCB Design', accent: '' },
    { label: 'AWS Cloud', accent: 'accent2' },
    { label: 'Computer Vision', accent: 'accent2' },
    { label: 'F1 Enthusiast', accent: 'accent3' },
  ],
  stats: [
    { number: '4', suffix: '+', label: 'Engineering Projects' },
    { number: '2', suffix: 'yrs', label: 'IEEE RAS Leadership' },
    { number: '2', suffix: '', label: 'Countries Worked In' },
  ],
  skills: [
    {
      icon: '<i class="devicon-embeddedc-plain"></i>',
      title: 'Hardware &amp; Embedded',
      pills: [
        'BJT Circuits','Op-Amps','Instrumentation Amps','Signal Conditioning',
        'SkyWater 130nm PDK','PCB Design','LTSpice','KiCad','Proteus','Multisim',
        '<i class="devicon-arduino-plain"></i> Arduino','ESP32',
        '<i class="devicon-raspberrypi-line"></i> Raspberry Pi','SolidWorks','AutoCAD',
      ],
    },
    {
      icon: '<i class="devicon-python-plain"></i>',
      title: 'Software &amp; Programming',
      pills: [
        '<i class="devicon-python-plain"></i> Python','<i class="devicon-c-plain"></i> C',
        '<i class="devicon-cplusplus-plain"></i> C++','<i class="devicon-matlab-plain"></i> MATLAB',
        '<i class="devicon-javascript-plain"></i> JavaScript','<i class="devicon-typescript-plain"></i> TypeScript',
        '<i class="devicon-react-plain"></i> React','<i class="devicon-nextjs-plain"></i> Next.js',
        '<i class="devicon-mysql-plain"></i> SQL','<i class="devicon-git-plain"></i> Git',
        '<i class="devicon-linux-plain"></i> Linux','<i class="devicon-docker-plain"></i> Docker',
      ],
    },
    {
      icon: '<i class="devicon-amazonwebservices-plain"></i>',
      title: 'IoT, Cloud &amp; AI',
      pills: [
        'LTE / 4G','MQTT / TLS','Wi-Fi / BLE',
        '<i class="devicon-amazonwebservices-plain"></i> AWS IoT Core','AWS Lambda',
        'DynamoDB','AWS CDK','YOLOv8 / CNN','Computer Vision',
        '<i class="devicon-tensorflow-original"></i> TensorFlow Lite','OpenCV',
        '<i class="devicon-numpy-plain"></i> NumPy','Scikit-learn',
      ],
    },
    {
      icon: '⚗️',
      title: 'Sensors &amp; Instrumentation',
      pills: [
        'NTC Thermistors','Electrochemical Sensors','Vision / NIR Systems',
        'Signal Acquisition','Calibration','FFT / Bode Analysis','Oscilloscope',
        'Function Generator','Sallen-Key Filter','SNR / Slew Rate','LiDAR / Point Cloud',
      ],
    },
    {
      icon: '✦',
      title: 'Languages',
      pills: [
        '🇨🇴 Spanish — Native','🇺🇸 English — Fluent','🇫🇷 French — Intermediate',
        '🇧🇷 Portuguese — Reading','🇹🇷 Turkish — Basic',
      ],
    },
  ],
  projects: [
    {
      featured: true,
      type: '🔬 Final Degree Project — In Progress',
      title: 'Early Corrosion Detection System for Steel — IoT + Computer Vision',
      description: `An interdisciplinary IoT system for detecting early-stage corrosion on steel plates in industrial environments.
        Developed in collaboration with <strong>Corpoacero</strong> (Barranquilla) and teams from mechanical and
        electronic engineering. A camera transmits daily images via LTE to a cloud backend where a custom-trained
        ML model identifies corrosion indicators invisible to the naked eye. Results are visualized on a web app
        with interactive plant maps showing per-plate status in real time.`,
      tags: ['Computer Vision','IoT / LTE','Custom ML Model','Industrial Application','Web Dashboard','Corpoacero'],
    },
    {
      type: 'Communications Lab — Universidad del Norte',
      title: 'IoT Occupancy Monitoring System with 3D Point Cloud Visualization',
      description: `End-to-end IoT system for real-time person detection and spatial localization in university classrooms.
        A Raspberry Pi 4 runs <strong>YOLOv8 Nano</strong> on-device (edge AI) at 6–10 FPS, transmitting
        detection coordinates via <strong>LTE (SIMCOM A7670SA)</strong> over MQTT/TLS to <strong>AWS IoT Core</strong>.
        Data flows through Lambda and DynamoDB into a <strong>Next.js dashboard</strong> and a
        <strong>Potree 3D point cloud viewer</strong>, displaying occupancy in near real-time with ~300ms latency.
        Infrastructure deployed as code using AWS CDK with a full CI/CD pipeline.`,
      tags: ['YOLOv8 Nano','Edge AI','Raspberry Pi 4','LTE / MQTT','AWS IoT Core','AWS Lambda','DynamoDB','Potree 3D','Next.js','AWS CDK'],
    },
    {
      type: 'Measurements & Instrumentation — Universidad del Norte',
      title: 'NTC Temperature Sensor: Signal Conditioning, Filtering & Linearization',
      description: `Precision temperature measurement system built around a full instrumentation amplifier circuit. The nonlinear sensor response was mathematically characterized and corrected through hardware-level linearization, achieving high accuracy across the full measurement range.`,
      tags: ['UA741 Op-Amp','Sallen-Key Filter','Signal Conditioning','NTC Thermistor','PCB Design','LTSpice','SNR 37.6 dB'],
    },
    {
      type: '⚙️ Electronics III',
      title: 'Temperature & Humidity Sensor with BJT-based Op-Amp',
      description: `Designed and implemented a functional operational amplifier entirely from discrete BJT transistors,
        then used it as the analog front-end for a temperature and humidity sensing system.
        A deep-dive into the physics behind the components most engineers treat as black boxes.`,
      tags: ['BJT Design','Op-Amp from Scratch','Analog Circuits','Sensor Interface'],
    },
  ],
  certifications: [
    {
      org: 'Cisco Networking Academy',
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco — Verified Certificate',
      desc: 'Fundamentals of cybersecurity, network security, and threat detection. Relevant to IoT and connected sensor systems where network security is a critical layer.',
    },
  ],
  experience: [
    {
      period: 'Summer 2026 — Upcoming',
      title: 'Assistant Director',
      org: 'Kiddie Keep Well Camp — Middlesex County, NJ',
      desc: `Contracted to join senior leadership as Assistant Director at <strong>Kiddie Keep Well Camp</strong>, a nonprofit residential camp serving children from low-income families. A role earned through four summers of progressive growth within the organization.`,
    },
    {
      period: 'Summer 2025',
      title: 'Program Director',
      org: 'Kiddie Keep Well Camp — Middlesex County, NJ',
      desc: 'Designed and managed the full activity curriculum across all age groups. Led a team of counselors, coordinated logistics, and maintained program quality throughout the season.',
    },
    {
      period: 'Summer 2024',
      title: 'Head Counselor',
      org: 'Kiddie Keep Well Camp — Middlesex County, NJ',
      desc: 'Supervised a group of counselors, ensuring camper wellbeing and program consistency. First leadership role within the camp organization.',
    },
    {
      period: 'Summer 2023',
      title: 'Camp Counselor',
      org: 'Kiddie Keep Well Camp — Middlesex County, NJ',
      desc: 'First summer at KKWC via the J1 cultural exchange visa program. Directly responsible for a group of campers, building the foundation of trust and leadership that led to rapid promotion in subsequent years.',
    },
    {
      period: '2023 — 2024',
      title: 'President, IEEE Robotics & Automation Society',
      org: 'Universidad del Norte — Barranquilla, Colombia',
      desc: 'Led the student branch of IEEE RAS at Uninorte, organizing technical workshops, invited talks, and collaborative projects between students and the broader robotics and automation community.',
    },
    {
      period: '2022 — 2023',
      title: 'Vice President, IEEE Robotics & Automation Society',
      org: 'Universidad del Norte — Barranquilla, Colombia',
      desc: 'Supported chapter operations, coordinated events, and helped grow member engagement across robotics, automation, and electronics disciplines.',
    },
  ],
  contact: {
    email: 'jab@example.com', // update with real email
    linkedin: 'https://www.linkedin.com/in/andresjsaco',
    linkedinHandle: 'linkedin.com/in/andresjsaco',
    location: 'Barranquilla, Colombia',
  },
};

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', data);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
