import type {
  Achievement,
  Certification,
  EducationEntry,
  PersonalInfo,
  Skill,
  StatItem,
} from '@/types';

export const personalInfo: PersonalInfo = {
  name: 'Nasirahmed Sayyed',
  initials: 'NS',
  title: 'Full Stack .NET Developer',
  roles: ['Full Stack .NET Developer', 'React.js Engineer', 'SaaS Product Builder'],
  location: 'Sangli, Maharashtra, India',
  email: 'nasirsayyed84@gmail.com',
  phone: '+91-8485005212',
  availability: 'Available for work',
  city: 'Sangli',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  summary:
    'Results-driven Full Stack .NET Developer with 4+ years of experience designing and delivering responsive web applications, SaaS products, microservices, and data visualization platforms. Proficient in C#, .NET Core 8, React.js 19, and SQL Server, with hands-on experience building products end-to-end — from user onboarding to payment gateway integration (Razorpay). Proven track record of automating workflows and building scalable solutions across logistics, healthcare, agriculture, and government domains.',
  about:
    "I'm a full-stack .NET developer who has spent four-plus years turning messy, real-world workflows into software people rely on every day. Most recently I built LogiSKU, a warehouse-management SaaS, end to end — from sign-up and onboarding to Razorpay subscription billing. Before that I shipped seven production platforms at Techlore: real-time analytics dashboards, a disease heatmap spanning 50+ countries, an adoption portal for 100+ case managers and a government research platform over 10,000+ records. I work across C#, .NET Core 8, React.js 19 and SQL Server, and I care most about the unglamorous parts — data that stays in sync, reports nobody has to build by hand, and interfaces that load fast.",
  valueProposition:
    'I build end-to-end SaaS products and data-heavy platforms with .NET and React — from onboarding and payments to real-time dashboards.',
  coreStack: ['C#', '.NET Core 8', 'React.js 19', 'SQL Server'],
  domains: ['Logistics', 'Healthcare', 'Agriculture', 'Government'],
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'Email', url: 'mailto:nasirsayyed84@gmail.com', icon: 'mail' },
    { label: 'Phone', url: 'tel:+918485005212', icon: 'phone' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/nasirahmed-sayyed', icon: 'linkedin' },
    { label: 'GitHub', url: 'https://github.com/nasirsayyed/', icon: 'github' },
    { label: 'HackerRank', url: 'https://www.hackerrank.com/nasirsayyed84', icon: 'code' },
  ],
};

export const stats: StatItem[] = [
  { label: 'Years shipping production software', value: 4, suffix: '+' },
  { label: 'Products shipped', value: 8, suffix: '' },
  { label: 'Companies', value: 2, suffix: '' },
  { label: 'Industries served', value: 4, suffix: '' },
];

export const skills: Skill[] = [
  { name: 'C#', category: 'Languages', layer: 'api' },
  { name: 'JavaScript', category: 'Languages', layer: 'client' },
  { name: 'SQL', category: 'Languages', layer: 'data' },
  { name: 'HTML5', category: 'Languages', layer: 'client' },
  { name: 'CSS3', category: 'Languages', layer: 'client' },

  { name: '.NET Core 8', category: 'Frameworks', layer: 'api' },
  { name: 'ASP.NET MVC', category: 'Frameworks', layer: 'api' },
  { name: 'React.js 19', category: 'Frameworks', layer: 'client' },
  { name: 'AngularJS', category: 'Frameworks', layer: 'client' },
  { name: 'ADO.NET', category: 'Frameworks', layer: 'data' },
  { name: 'Entity Framework', category: 'Frameworks', layer: 'data' },

  { name: 'jQuery', category: 'Front-End', layer: 'client' },
  { name: 'Bootstrap', category: 'Front-End', layer: 'client' },
  { name: 'JQWidgets', category: 'Front-End', layer: 'client' },
  { name: 'ECharts.js', category: 'Front-End', layer: 'client' },
  { name: 'Leaflet.js', category: 'Front-End', layer: 'client' },

  { name: 'REST API / Web API', category: 'APIs & Integration', layer: 'api' },
  { name: 'Razorpay', category: 'APIs & Integration', layer: 'api' },
  { name: 'AJAX', category: 'APIs & Integration', layer: 'client' },
  { name: 'JSON', category: 'APIs & Integration', layer: 'api' },

  { name: 'MS SQL Server', category: 'Databases', layer: 'data' },

  { name: 'Visual Studio 2022', category: 'Tools', layer: 'tooling' },
  { name: 'Git', category: 'Tools', layer: 'tooling' },
  { name: 'Postman', category: 'Tools', layer: 'tooling' },
  { name: 'SSMS', category: 'Tools', layer: 'tooling' },

  { name: 'Agile / Scrum', category: 'Practices', layer: 'tooling' },
  { name: 'Microservices', category: 'Practices', layer: 'api' },
  { name: 'MVC', category: 'Practices', layer: 'api' },

  { name: 'Azure (Fundamentals)', category: 'Cloud', layer: 'tooling' },
];

export const achievements: Achievement[] = [
  {
    title: 'SaaS Product, End-to-End',
    description:
      'Owned the LogiSKU WMS SaaS platform from sign-up and onboarding through subscription billing, built on React.js 19 and .NET Core 8.',
    icon: 'rocket',
  },
  {
    title: 'Payment Gateway Integration',
    description:
      'Integrated Razorpay for secure, automated subscription payments and seamless checkout flows.',
    icon: 'credit-card',
  },
  {
    title: 'Enterprise Dashboards',
    description:
      'Architected real-time analytics dashboards with ECharts.js and JQWidgets, cutting load time by 30% via modular iframe rendering.',
    icon: 'gauge',
  },
  {
    title: 'Workflow Automation',
    description:
      'Built automated console applications for scheduled email reporting and stored-procedure triggers, saving 6+ hours per week.',
    icon: 'layers',
  },
  {
    title: 'Data Visualization at Scale',
    description:
      'Delivered interactive Leaflet.js map visualizations covering 50+ countries and 10,000+ research records for government and healthcare platforms.',
    icon: 'cloud',
  },
  {
    title: 'Cross-Domain Delivery',
    description:
      'Shipped production software across logistics, healthcare, agriculture, and government domains, serving 100+ end users per platform.',
    icon: 'users',
  },
];

export const education: EducationEntry[] = [
  {
    degree: 'Bachelor of Engineering',
    field: 'Computer Science',
    institution: 'ATS Sanjay Bhokare Group of Institutes, Miraj, Sangli',
    period: 'July 2017 – March 2020',
    detail: '85.31%',
  },
];

export const certifications: Certification[] = [
  {
    name: 'JavaScript (Intermediate)',
    issuer: 'HackerRank',
    url: 'https://www.hackerrank.com/certificates/4409a2bd9f76',
  },
  {
    name: 'SQL (Intermediate)',
    issuer: 'HackerRank',
    url: 'https://www.hackerrank.com/certificates/2f3f16d64ca3',
  },
];
