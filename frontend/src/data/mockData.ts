export const conversionChartData = [
  { date: "Oct 01", score: 68 },
  { date: "Oct 05", score: 72 },
  { date: "Oct 10", score: 70 },
  { date: "Oct 15", score: 75 },
  { date: "Oct 20", score: 74 },
  { date: "Oct 25", score: 78 },
  { date: "Oct 30", score: 80 },
];

export const issueBreakdownData = [
  { category: "Performance", value: 45, color: "#5B7BFF" },
  { category: "UX/UI", value: 26, color: "#A78BFA" },
  { category: "Content", value: 20, color: "#38BDF8" },
  { category: "SEO", value: 16, color: "#22D3EE" },
];

export const webVitalsData = [
  { metric: "LCP", value: 72, color: "#EF4444" },
  { metric: "FID", value: 88, color: "#22C55E" },
  { metric: "CLS", value: 55, color: "#F59E0B" },
  { metric: "TBT", value: 65, color: "#F59E0B" },
];

export const recentUrlHistory = [
  { url: "https://stripe.com", score: 92, when: "2 hours ago" },
  { url: "https://linear.app", score: 88, when: "Yesterday" },
  { url: "https://vercel.com", score: 74, when: "3 days ago" },
  { url: "https://supabase.com", score: 81, when: "1 week ago" },
];

export const engineLogs = [
  "[System] Analysis engine initialized for 'https://acme-store.com'",
  "[Crawler] Found sitemap.xml. Starting deep traversal...",
  "[UX Audit] Analyzing Largest Contentful Paint (LCP)...",
  "[Crawler] 200 OK /products/summer-collection-2024",
  "[UX Audit] Detected accessibility warning: Low contrast on footer links.",
  "[System] Resource usage: 42% CPU, 1.2GB RAM",
  "[Crawler] Discovered 50 new internal links...",
];

export const topRecommendations = [
  { title: "Fix Checkout Button", impact: "+12.4%", effort: "Low CW", color: "#EF4444" },
  { title: "Optimize Hero Content", impact: "+4.2%", effort: "co-ordinement", color: "#F59E0B" },
  { title: "Update SSL Cert", impact: "", effort: "Task Guide", color: "#5B7BFF" },
];

export const actionableFixes = [
  {
    priority: "HIGH",
    priorityColor: "#EF4444",
    title: "Resolve Mobile Checkout Button Conflict",
    description:
      "Our analysis engine detected the checkout button on mobile is < 768px is obscured by a floating 'help' widget, preventing users from completing purchases.",
    steps: [
      "Locate the 'Help Widget' container in your CSS/Theme settings.",
      "Add a 4px bottom margin to the checkout button for touch safety.",
    ],
  },
  {
    priority: "FAIR",
    priorityColor: "#F59E0B",
    title: "Revise Hero Headline for Value Proposition",
    description: "The current headline doesn't communicate the core value clearly enough.",
    steps: [],
  },
  {
    priority: "MEDIUM",
    priorityColor: "#5B7BFF",
    title: "Enable CSS Compression & Minification",
    description: "CSS files are unminified and adding load time.",
    steps: [],
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for personal projects",
    features: [
      "5 Website Analyses / mo",
      "Core Web Vitals Report",
      "Basic SEO Check",
      "Priority Support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing teams and agencies",
    features: [
      "50 Analyses / month",
      "Heatmap Simulation",
      "Conversion Funnel Maps",
      "Priority Support",
      "Team Members (5)",
      "API Access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    features: [
      "Unlimited Analyses",
      "Custom Integrations",
      "Dedicated Account Manager",
      "White Label Reports",
      "SLA Guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const landingFeatures = [
  {
    title: "Heatmap Simulation",
    description: "Visualize where users drop off without installing heavy tracking scripts.",
    icon: "Thermostat",
  },
  {
    title: "Conversion Audits",
    description: "Automated analysis of your funnel using real performance data.",
    icon: "Assessment",
  },
  {
    title: "Speed Insights",
    description: "Get performance bottlenecks that directly impact your earning rate.",
    icon: "Speed",
  },
  {
    title: "Security Scan",
    description: "Ensure your trust badges and SSL certifications are performing correctly.",
    icon: "Security",
  },
  {
    title: "Smart Recommendations",
    description: "Receive prioritized action items ranked by potential conversion impact.",
    icon: "Lightbulb",
  },
  {
    title: "Layout Analysis",
    description: "AI identifies UX friction points that decrease conversions overnight.",
    icon: "ViewQuilt",
  },
];
