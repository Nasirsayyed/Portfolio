import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'logisku',
    title: 'LogiSKU — WMS SaaS Platform',
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
    gradient: ['#2563eb', '#7c3aed'],
  },
  {
    id: 'rb-dashboard',
    title: 'RB Dashboard',
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
    gradient: ['#0ea5e9', '#22d3ee'],
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation Suite',
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
    gradient: ['#16a34a', '#84cc16'],
  },
  {
    id: 'sofosh-hsr',
    title: 'Sofosh HSR Portal',
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
    gradient: ['#db2777', '#f97316'],
  },
  {
    id: 'valneva-heatmap',
    title: 'Valneva Disease Heatmap',
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
    gradient: ['#dc2626', '#f59e0b'],
  },
  {
    id: 'emo-wms',
    title: 'EMO Warehouse Management System',
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
    gradient: ['#0891b2', '#2563eb'],
  },
  {
    id: 'buktec-middleware',
    title: 'BukTec Desktop Middleware',
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
    gradient: ['#7c3aed', '#db2777'],
  },
  {
    id: 'maha-gen-bank',
    title: 'Maha Gen Bank Platform',
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
    gradient: ['#059669', '#0ea5e9'],
  },
];
