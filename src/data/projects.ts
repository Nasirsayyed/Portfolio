import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'logisku',
    metric: { value: 'E2E', label: 'Sign-up to subscription billing' },
    name: 'LogiSKU',
    tagline: 'Warehouse Management SaaS',
    year: '2026',
    featured: true,
    problem:
      'Turn a warehouse-management product into a self-serve SaaS: customers had to be able to sign up, get onboarded and pay for a subscription on their own.',
    approach:
      'Built the product end to end on React.js 19 and .NET Core 8, owning every step of the user journey, and integrated the Razorpay gateway for subscription billing.',
    result: 'A complete SaaS flow — sign-up, onboarding, and secure, automated subscription payments with a seamless checkout.',
    company: 'Simulytics Tech Private Limited',
    period: 'April 2026 – Present',
    description:
      'A Warehouse Management SaaS product built end-to-end, covering the full user journey from sign-up and onboarding to subscription billing.',
    role: 'Full-stack developer, owning the product end-to-end.',
    features: [
      'End-to-end user journey from sign-up and onboarding to subscription billing',
      'Razorpay integration for secure, automated subscription payments',
      'Seamless checkout experience for SaaS subscribers',
    ],
    technologies: ['React.js 19', '.NET Core 8', 'Razorpay', 'REST API', 'SQL Server'],
  },
  {
    id: 'rb-dashboard',
    metric: { value: '−30%', label: 'Dashboard load time' },
    name: 'RB Dashboard',
    tagline: 'Real-time analytics dashboard',
    year: '2021–26',
    problem:
      'One analytics dashboard had to serve different roles from a single codebase, and it was slow to load.',
    approach:
      'Architected it on ECharts.js and JQWidgets (.NET) with database-driven menus, role-based access control and modular iframe rendering.',
    result: 'Real-time, responsive analytics with 30% faster dashboard load times.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'A real-time responsive analytics dashboard with dynamic, database-driven menu rendering and role-based access control.',
    role: 'Architected the dashboard architecture and rendering pipeline.',
    features: [
      'Real-time responsive analytics dashboard using ECharts.js and JQWidgets (.NET)',
      'Dynamic database-driven menu rendering',
      'Role-based access control',
      'Modular iframe rendering — reduced dashboard load time by 30%',
    ],
    technologies: ['.NET', 'ECharts.js', 'JQWidgets', 'SQL Server'],
  },
  {
    id: 'workflow-automation',
    metric: { value: '6h+', label: 'Manual reporting saved weekly' },
    name: 'Workflow Automation',
    tagline: 'Scheduled reporting engine',
    year: '2021–26',
    problem:
      'Recurring reports were compiled and emailed by hand, costing 6+ hours every week.',
    approach:
      'Built scheduled console applications that trigger stored procedures, generate Excel reports and email them automatically.',
    result: '6+ hours a week of manual reporting eliminated.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'Automated console applications that eliminate manual reporting work through scheduled notifications and stored procedure triggers.',
    role: 'Designed and built the automation console applications.',
    features: [
      'Scheduled email notifications with Excel report attachments',
      'Automated triggers for stored DB procedures',
      'Eliminated 6+ hours per week of manual reporting effort',
    ],
    technologies: ['C#', '.NET', 'SQL Server'],
  },
  {
    id: 'sofosh-hsr',
    metric: { value: '100+', label: 'Case managers served' },
    name: 'Sofosh HSR Portal',
    tagline: 'Adoption case management',
    year: '2021–26',
    problem:
      'Case managers needed one place to run adoption cases — records, documents, reminders and follow-up after placement.',
    approach:
      'Developed a full-stack React.js + .NET Core app with CRUD workflows, file uploads, email reminders and post-placement tracking.',
    result: 'A mobile-responsive portal serving 100+ case managers.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'A full-stack adoption management web application serving case managers with CRUD workflows, file uploads, and post-placement tracking.',
    role: 'Full-stack development across React.js frontend and .NET Core backend.',
    features: [
      'CRUD operations for adoption case management',
      'File uploads and automated email reminders',
      'Post-placement tracking workflows',
      'Mobile-responsive UI serving 100+ case managers',
    ],
    technologies: ['React.js', '.NET Core', 'SQL Server'],
  },
  {
    id: 'valneva-heatmap',
    metric: { value: '50+', label: 'Countries on the heatmap' },
    name: 'Valneva Heatmap',
    tagline: 'Global disease surveillance map',
    year: '2021–26',
    problem:
      'Daily disease data arriving from external APIs had to become something people could explore geographically.',
    approach:
      'Engineered a .NET Core microservice that ingests and persists the daily records, feeding an interactive Leaflet.js heatmap.',
    result: 'Global case distribution visualised across 50+ countries.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'A .NET Core microservice ingesting daily disease records from external APIs to power an interactive global heatmap.',
    role: 'Engineered the ingestion microservice and visualization integration.',
    features: [
      '.NET Core microservice ingesting and persisting daily disease records from external APIs',
      'Interactive Leaflet.js global heatmap',
      'Case distribution visualization across 50+ countries',
    ],
    technologies: ['.NET Core', 'Leaflet.js', 'REST API'],
  },
  {
    id: 'emo-wms',
    metric: { value: '20+', label: 'Warehouse staff on the system' },
    name: 'EMO WMS',
    tagline: 'Warehouse operations front end',
    year: '2021–26',
    problem:
      'Warehouse staff needed to find and act on live operational data quickly.',
    approach:
      'Built front-end modules in JavaScript, AJAX and JSON with dynamic grid filtering and real-time data rendering.',
    result: 'Streamlined day-to-day operations for 20+ warehouse staff.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'Front-end modules for a web-based WMS with dynamic grid filtering and real-time data rendering.',
    role: 'Built the front-end modules and real-time data grid.',
    features: [
      'Dynamic grid filtering',
      'Real-time data rendering',
      'Streamlined operations for 20+ warehouse staff',
    ],
    technologies: ['JavaScript', 'AJAX', 'JSON'],
  },
  {
    id: 'buktec-middleware',
    metric: { value: '−80%', label: 'Manual data entry' },
    name: 'BukTec Middleware',
    tagline: 'ERP ↔ web sync',
    year: '2021–26',
    problem:
      "Data was re-keyed by hand between Tally ERP and BukTec's web platform, and the two drifted out of sync.",
    approach:
      'Designed a desktop middleware application that syncs data in both directions between Tally ERP and the BukTec Web APIs.',
    result: '80% less manual data entry and no more sync errors.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'A desktop middleware application automating bi-directional data sync between Tally ERP and BukTec Web APIs.',
    role: 'Designed the middleware application and sync architecture.',
    features: [
      'Bi-directional data sync between Tally ERP and BukTec Web APIs',
      'Reduced manual data entry by 80%',
      'Eliminated sync errors',
    ],
    technologies: ['C#', '.NET', 'REST API'],
  },
  {
    id: 'maha-gen-bank',
    metric: { value: '10k+', label: 'Research records explored' },
    name: 'Maha Gen Bank',
    tagline: 'Government research data platform',
    year: '2021–26',
    problem:
      "Maharashtra's agricultural scientists had 10,000+ plant-science research records but no easy way to explore them.",
    approach:
      'Built a government data-visualisation platform with interactive Leaflet.js maps, dynamic charts and advanced filtering.',
    result: '10,000+ research records explorable by map, chart and filter.',
    company: 'Techlore',
    period: 'November 2021 – March 2026',
    description:
      'A government data visualization platform for Maharashtra agricultural scientists covering plant science research records.',
    role: 'Built the mapping, charting, and filtering experience.',
    features: [
      'Interactive Leaflet.js maps',
      'Dynamic charts and advanced filtering',
      'Coverage across 10,000+ plant science research records',
    ],
    technologies: ['Leaflet.js', 'JavaScript', '.NET', 'SQL Server'],
  },
];
