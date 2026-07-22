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
  availability: 'Available for Opportunities',
  summary:
    'Results-driven Full Stack .NET Developer with 4+ years of experience designing and delivering responsive web applications, SaaS products, microservices, and data visualization platforms. Proficient in C#, .NET Core 8, React.js 19, and SQL Server, with hands-on experience building products end-to-end — from user onboarding to payment gateway integration (Razorpay). Proven track record of automating workflows and building scalable solutions across logistics, healthcare, agriculture, and government domains.',
  valueProposition:
    'I build end-to-end SaaS products and data-driven platforms with React.js and .NET Core — from onboarding and payments to real-time dashboards.',
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
  { label: 'Years of Experience', value: 4, suffix: '+' },
  { label: 'Projects Shipped', value: 8, suffix: '' },
  { label: 'Companies', value: 2, suffix: '' },
  { label: 'Domains Delivered In', value: 4, suffix: '' },
];

export const skills: Skill[] = [
  { name: 'C#', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'HTML5', category: 'Languages' },
  { name: 'CSS3', category: 'Languages' },

  { name: '.NET Core 8', category: 'Frameworks' },
  { name: 'ASP.NET MVC', category: 'Frameworks' },
  { name: 'React.js 19', category: 'Frameworks' },
  { name: 'AngularJS', category: 'Frameworks' },
  { name: 'ADO.NET', category: 'Frameworks' },
  { name: 'Entity Framework', category: 'Frameworks' },

  { name: 'jQuery', category: 'Front-End' },
  { name: 'Bootstrap', category: 'Front-End' },
  { name: 'JQWidgets', category: 'Front-End' },
  { name: 'ECharts.js', category: 'Front-End' },
  { name: 'Leaflet.js', category: 'Front-End' },

  { name: 'REST API / Web API', category: 'APIs & Integration' },
  { name: 'Razorpay', category: 'APIs & Integration' },
  { name: 'AJAX', category: 'APIs & Integration' },
  { name: 'JSON', category: 'APIs & Integration' },

  { name: 'MS SQL Server', category: 'Databases' },

  { name: 'Visual Studio 2022', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
  { name: 'Postman', category: 'Tools' },
  { name: 'SSMS', category: 'Tools' },

  { name: 'Agile / Scrum', category: 'Practices' },
  { name: 'Microservices', category: 'Practices' },
  { name: 'MVC', category: 'Practices' },

  { name: 'Azure (Fundamentals)', category: 'Cloud' },
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
