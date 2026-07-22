import type { ExperienceEntry } from '@/types';

export const experience: ExperienceEntry[] = [
  {
    id: 'simulytics',
    company: 'Simulytics Tech Private Limited',
    role: 'Software Engineer',
    period: 'April 2026 – Present',
    location: 'Pune, India',
    current: true,
    summary:
      'Building LogiSKU, a Warehouse Management SaaS platform, end-to-end — from the user journey and onboarding through subscription billing and payments.',
    highlights: [
      'Built the LogiSKU Warehouse Management SaaS product end-to-end using React.js 19 and .NET Core 8, owning the full user journey from sign-up and onboarding to subscription billing.',
      'Integrated the Razorpay payment gateway to enable secure, automated subscription payments and seamless checkout.',
    ],
    technologies: ['React.js 19', '.NET Core 8', 'Razorpay', 'REST API', 'SQL Server'],
  },
  {
    id: 'techlore',
    company: 'Techlore',
    role: 'Software Engineer',
    period: 'November 2021 – March 2026',
    location: 'Pune, India',
    current: false,
    summary:
      'Delivered 7 production platforms across analytics, healthcare, agriculture, logistics, and ERP integration — spanning dashboards, automation, and geospatial data visualization.',
    highlights: [
      'RB Dashboard: Architected a real-time responsive analytics dashboard using ECharts.js and JQWidgets (.NET), with dynamic database-driven menu rendering and role-based access control, reducing dashboard load time by 30% through modular iframe rendering.',
      'Workflow Automation: Built automated console applications that schedule email notifications with Excel report attachments and trigger stored DB procedures, eliminating 6+ hours/week of manual reporting effort.',
      'Sofosh HSR Portal: Developed a full-stack adoption management web app (React.js + .NET Core) with CRUD operations, file uploads, email reminders, and post-placement tracking — delivering a mobile-responsive UI serving 100+ case managers.',
      'Valneva Disease Heatmap: Engineered a .NET Core microservice that ingests and persists daily disease records from external APIs, powering an interactive Leaflet.js global heatmap visualizing case distribution across 50+ countries.',
      'EMO Warehouse Management System: Built front-end modules for a web-based WMS using JavaScript, AJAX, and JSON, implementing dynamic grid filtering and real-time data rendering to streamline operations for 20+ warehouse staff.',
      'BukTec Desktop Middleware: Designed a desktop middleware application to automate bi-directional data sync between Tally ERP and BukTec Web APIs, reducing manual data entry by 80% and eliminating sync errors.',
      'Maha Gen Bank Platform: Built a government data visualization platform for Maharashtra agricultural scientists, integrating interactive Leaflet.js maps, dynamic charts, and advanced filtering across 10,000+ plant science research records.',
    ],
    technologies: [
      'React.js',
      '.NET Core',
      'ECharts.js',
      'JQWidgets',
      'Leaflet.js',
      'JavaScript',
      'AJAX',
      'SQL Server',
      'C#',
    ],
  },
];
