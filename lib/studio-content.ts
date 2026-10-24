// Copy supplied in website content.txt.
export const services = [
  {
    number: "01",
    name: "Strategy",
    line: "Here’s the tea. Plan before pixels.",
    title: "Brand Strategy & Market Research Agency",
    description:
      "We study your market, audience and competitors, then turn those insights into a clear plan.",
    items: [
      "Market and competitor research",
      "Audience insights",
      "Brand positioning",
      "Growth and launch roadmaps",
    ],
  },
  {
    number: "02",
    name: "Design",
    line: "Steeped in design principles.",
    title: "Creative Design Studio for Brands That Stand Out",
    description: "Design backed by research, so every visual has a reason.",
    items: [
      "Design research and creative direction",
      "Visual identity and graphic design",
      "Social media and campaign creatives",
      "Packaging and print design",
    ],
  },
  {
    number: "03",
    name: "Marketing",
    line: "Positivi-tea, amplified.",
    title: "Digital Marketing & Social Media Agency",
    description:
      "We plan and run digital campaigns that reach the right people in India and globally, and turn attention into customers.",
    items: [
      "Social media marketing and management",
      "Meta ads on Facebook and Instagram",
      "Digital marketing campaigns from planning to execution",
      "Content marketing and creative strategy",
      "Audience targeting and performance reporting",
      "SEO-led content and growth strategy",
    ],
  },
  {
    number: "04",
    name: "Branding",
    line: "Your brand, freshly brewed.",
    title: "Brand Identity & Logo Design Agency",
    description:
      "From a first-time brand to a full refresh, we build a look, voice and story that stay consistent everywhere.",
    items: [
      "Brand identity and logo design",
      "Brand voice and messaging",
      "Brand guidelines",
      "Rebranding",
    ],
  },
];

export const launchItems = [
  "Product and brand launches, planned and rolled out end to end",
  "Launch events, pop-ups and brand experiences",
  "Social media coverage with reels, stories and live content",
  "Influencer outreach, from finding the right creators to managing them",
];

export const industries = [
  "Food & Beverage",
  "Hospitality & Hotels",
  "Fashion & Lifestyle",
  "Jewellery & Luxury",
  "Media & Communication",
  "Weddings & Events",
  "Dental, Medical & Healthcare",
  "Pharma & Life Sciences",
  "Industrial & Manufacturing",
];

export const process = [
  {
    title: "Listen.",
    text: "Over tea, we learn your business and goals.",
    note: "A good conversation leads to a good idea, and a good idea leads to design that works.",
    label: "Start with a conversation",
    items: ["Your business", "Your audience", "Your goals"],
    href: "/studio",
    link: "Meet the studio",
  },
  {
    title: "Research.",
    text: "We study your market and audience.",
    note: services[0].description,
    label: services[0].line,
    items: services[0].items,
    href: "/services#strategy",
    link: "Explore strategy",
  },
  {
    title: "Create.",
    text: "Strategy, design and brand assets.",
    note: services[1].description,
    label: services[1].line,
    items: [
      "Visual identity and logo design",
      "Brand voice and messaging",
      "Packaging and print design",
      "Social media and campaign creatives",
    ],
    href: "/services#design",
    link: "Explore design",
  },
  {
    title: "Launch.",
    text: "We go live, measure and improve.",
    note: "Launch 24 is our full-service launch team. We plan it, run it and make sure everyone’s talking about it.",
    label: "Pour it hot. Launch loud.",
    items: [
      "Product and brand launches",
      "Digital marketing campaigns",
      "Influencer outreach",
      "Performance reporting",
    ],
    href: "/#launch-24",
    link: "Discover Launch 24",
  },
];

export const reasons = [
  { title: "Research-led.", text: "Insight, not guesswork." },
  {
    title: "Design-first.",
    text: "Strong visuals built on proven principles.",
  },
  {
    title: "One team.",
    text: "Strategy, design, marketing, branding and launches under one roof.",
  },
  { title: "Results-focused.", text: "We measure success by your growth." },
];
