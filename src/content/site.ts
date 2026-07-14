/**
 * Single source of content for the homepage.
 *
 * Every string here is taken from msc-website-architecture-rewritten.md.
 * Where the architecture guide lists an item under "Assets Required From
 * Client" (student stories, rank-holder details, video testimonials), the
 * entry is marked `placeholder: true` and carries no invented name, mark,
 * rank or quote. Replace those entries — do not add claims elsewhere.
 */

export const contact = {
  whatsapp: "8050085005",
  support: "8971265511",
  email: "support@brainathon.in",
  hours: "10 AM–5 PM",
  address: "No. 57, 6th Main, Nagendra Block, BSK II Stage, Bengaluru",
  social: "@coachacharya",
} as const;

/** Pre-filled WhatsApp deep link. 91 = India country code. */
export const whatsappHref = `https://wa.me/91${contact.whatsapp}?text=${encodeURIComponent(
  "Hi, I'd like to know more about the programs at Magical Students Club.",
)}`;

export const telHref = `tel:+91${contact.whatsapp}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  supporting:
    "Memory techniques, speed reading, concentration, and smarter study strategies for Grade 5+ students and competitive exam aspirants.",
} as const;

/**
 * Section intros and per-item supporting lines.
 *
 * These are written to fill the taller presentation-style sections. Every line
 * is a restatement of something the architecture guide already establishes —
 * no new claim, number, credential or testimonial is introduced here.
 */
export const trust = {
  eyebrow: "Trust & Credibility",
  heading: "Two decades of teaching students how to learn",
  intro:
    "The numbers below come from twenty years of classroom and workshop practice with school students and competitive exam aspirants.",
  statement:
    "Every programme is taught by a coach who has spent his career on one question: how do students actually remember what they study?",
} as const;

export const stats = [
  {
    icon: "users",
    value: "90,000+",
    label: "Students Trained",
    detail: "Across schools, workshops and the academy.",
  },
  {
    icon: "calendar",
    value: "20+",
    label: "Years of Experience",
    detail: "Two decades refining how memory is taught.",
  },
  {
    icon: "award",
    value: "45+",
    label: "Rank Holders",
    detail: "Aspirants who carried technique into their exams.",
  },
  {
    icon: "star",
    value: "4.8★",
    label: "Google Rating",
    detail: "From the parents and students we work with.",
  },
] as const;

export const challengesIntro = {
  lead: "Most students are not short of effort. They are short of a method — so the hours go in and very little stays.",
  transition:
    "Each of these has the same root cause, and none of them is fixed by studying longer.",
} as const;

export const methodIntro = {
  lead: "Learning is a sequence, not a single act. Skip a stage and the rest gives way — which is why re-reading fails and recall breaks down in the exam hall.",
} as const;

export const programsIntro = {
  lead: "Three routes into the same skill, chosen by where a student is and what they are working towards.",
  cta: "Not sure which fits? Tell us the grade or the exam and we will point you to the right one.",
} as const;

export const hybridIntro = {
  lead: "Recorded lessons alone do not change how a student studies. The hybrid model pairs them with live practice, daily doubt clearing and a facilitator, so technique is actually put to work.",
} as const;

export const resultsIntro = {
  lead: "What changes when a student learns how to learn.",
  testimonialsLead:
    "In their own words — parents and students we have worked with, shared with their permission.",
} as const;

export const faqIntro = {
  lead: "The questions parents ask us most often. If yours is not here, message us on WhatsApp and we will answer it directly.",
} as const;

export const challenges = [
  {
    icon: "repeat",
    title: "The Re-Reading Trap",
    body: "Studies for hours but forgets quickly.",
  },
  {
    icon: "refresh",
    title: "The Tuition Carousel",
    body: "Moves from one tuition to another without lasting improvement.",
  },
  {
    icon: "brain",
    title: "The Exam-Hall Blank",
    body: "Understands while studying but struggles to recall during exams.",
  },
] as const;

/**
 * The 5R labels come from the build brief, not the architecture guide, so they
 * carry no descriptive copy — writing one would mean inventing the method.
 */
export const fiveR = ["Read", "Retain", "Recall", "Revise", "Result"] as const;

export const learningSteps = [
  {
    icon: "lightbulb",
    label: "Understand",
    detail: "Make sense of the idea before trying to hold on to it.",
  },
  {
    icon: "brain",
    label: "Remember",
    detail: "Encode it with a technique, not by repetition.",
  },
  {
    icon: "sparkles",
    label: "Recall",
    detail: "Retrieve it without the book open.",
  },
  {
    icon: "pencil",
    label: "Apply",
    detail: "Use it on problems and past papers.",
  },
  {
    icon: "trophy",
    label: "Achieve",
    detail: "Walk into the exam able to produce it.",
  },
] as const;

export const programs = [
  {
    icon: "brain",
    title: "Memory Mastery Workshop",
    body: "Practical techniques to remember faster and retain longer.",
    detail:
      "The starting point for most students: the core memory methods, taught so they can be used the same week.",
    audience: "Grade 5+",
  },
  {
    icon: "layers",
    title: "Hybrid Learning Program",
    body: "Recorded learning, live practice, doubt clearing, and facilitator support.",
    detail:
      "For students who want the technique embedded into how they study every day, not just demonstrated once.",
    audience: "School Students",
  },
  {
    icon: "target",
    title: "Competitive Exam Track",
    body: "Learning and memory strategies for UPSC, NEET, JEE, SSC, Banking, and other exams.",
    detail:
      "Built around the volume and recall pressure of competitive papers, where re-reading stops working entirely.",
    audience: "Exam Aspirants",
  },
] as const;

export const hybridModel = [
  {
    icon: "play",
    title: "Learn at Your Pace",
    body: "Recorded lessons",
    detail: "Watch, pause and repeat a technique until it lands.",
    cadence: "anytime",
  },
  {
    icon: "help",
    title: "Daily Doubt Clearing",
    body: "Get questions resolved",
    detail: "No question waits until the next session.",
    cadence: "anytime",
  },
  {
    icon: "video",
    title: "Live Practice Sessions",
    body: "Guided implementation",
    detail: "Put the method to work with a coach watching.",
    cadence: "live",
  },
  {
    icon: "handshake",
    title: "Facilitator Support",
    body: "Continuous guidance",
    detail: "Someone tracking whether the habit is sticking.",
    cadence: "live",
  },
] as const;

export const coach = {
  name: "Pradeep Acharya",
  eyebrow: "Meet Your Coach",
  bio: "A Mechanical Engineer by qualification and a Memory Coach by passion, Pradeep Acharya helps students develop practical learning, memory, focus, and recall skills.",
  bioExtra:
    "Over twenty years he has worked with more than 90,000 students — in schools, in workshops and at the academy — and trained under global memory experts. The approach has stayed the same throughout: give a student a method they can use, rather than tell them to study harder.",
  credibility: [
    { icon: "calendar", text: "20+ Years of Experience" },
    { icon: "users", text: "90,000+ Students Trained" },
    { icon: "brain", text: "Memory & Learning Coach" },
    { icon: "globe", text: "Mentored by Global Memory Experts" },
  ],
} as const;

/**
 * The guide names these three result categories and adds: "Do not publish
 * unverified performance claims." So these are categories, not numbers.
 * Add figures only once the client supplies verified ones.
 */
export const results = [
  {
    icon: "trending",
    title: "Academic improvements",
    body: "Stronger marks driven by a better study method, not longer hours.",
  },
  {
    icon: "brain",
    title: "Better retention and recall",
    body: "Students hold on to what they learn and retrieve it under exam pressure.",
  },
  {
    icon: "award",
    title: "Rank holders and exam achievements",
    body: "Aspirants carrying memory technique into competitive exam preparation.",
  },
] as const;

export const videoTestimonials = [
  {
    id: "video-1",
    placeholder: false,
    thumbnail: "https://i.ytimg.com/vi/amAMBwVRQCU/hqdefault.jpg",
    youtubeId: "amAMBwVRQCU",
    name: null as string | null,
    role: null as string | null,
  },
  {
    id: "video-2",
    placeholder: false,
    thumbnail: "https://i.ytimg.com/vi/5_GBUxO6bVA/hqdefault.jpg",
    youtubeId: "5_GBUxO6bVA",
    name: null as string | null,
    role: null as string | null,
  },
] as const;

export const writtenTestimonials = [
  {
    id: "written-1",
    placeholder: false,
    quote:
      "My Board exams felt scary — I used to forget answers I knew. After the visualization technique I'm three questions in before the fear catches up. Top marks in Civics for the first time.",
    name: "Aarav Sinha",
    role: "Grade 10 Student · Lucknow",
    rating: 5,
  },
] as const;

export const faqs = [
  {
    q: "What age group are the programs for?",
    a: "The programs are built for Grade 5 and above, and for competitive exam aspirants preparing for exams such as UPSC, NEET, JEE, SSC and Banking.",
  },
  {
    q: "Are the sessions online or offline?",
    a: "Both. The hybrid model combines recorded lessons you can take at your own pace with live practice sessions and daily doubt clearing.",
  },
  {
    q: "How does the hybrid learning program work?",
    a: "You learn at your pace through recorded lessons, put the techniques into practice in guided live sessions, get your questions resolved in daily doubt clearing, and stay supported by a facilitator throughout.",
  },
  {
    q: "Is this suitable for competitive exam aspirants?",
    a: "Yes. The Competitive Exam Track applies learning and memory strategies specifically to UPSC, NEET, JEE, SSC, Banking and other exams.",
  },
  {
    q: "How can I speak with the team?",
    a: `Message us on WhatsApp at ${contact.whatsapp}, or call support on ${contact.support}. We are available ${contact.hours}.`,
  },
] as const;

export const finalCta = {
  headline:
    "Give your child the skill schools rarely teach — how to learn effectively.",
  supporting: "Speak with our team and find the right learning program.",
} as const;

/**
 * Copy for the inner pages (everything the header links to besides Home).
 * Same rule as the rest of this file: short, parent-focused, benefit-led, and
 * no invented number, name, or credential beyond what the architecture guide
 * already establishes. Where the guide calls for client-supplied assets that
 * don't exist yet (gallery photos, blog posts, rank-holder specifics), the
 * entry is marked `placeholder: true`.
 */

export const servicesPage = {
  eyebrow: "Services",
  heading: "Programs Built for Smarter Learning",
  intro:
    "Every program teaches the same underlying skill — how to learn — applied to where a student is right now.",
  audiences: [
    {
      key: "school",
      label: "School Students",
      body: "Grade 5 and above, building the study habits that carry through board exams and beyond.",
    },
    {
      key: "competitive",
      label: "Competitive Exam Aspirants",
      body: "UPSC, NEET, JEE, SSC, Banking and other exams, where recall under pressure is what actually counts.",
    },
  ],
  lifeSkills: [
    {
      icon: "brain",
      title: "Concentration",
      body: "Trains sustained focus, so study time is spent actually absorbing rather than drifting.",
    },
    {
      icon: "sparkles",
      title: "Speed Reading",
      body: "Covers more material in less time without losing comprehension.",
    },
    {
      icon: "target",
      title: "Exam Strategy",
      body: "Turns memory technique into a plan for the exam hall itself, not just the desk at home.",
    },
    {
      icon: "handshake",
      title: "Confidence",
      body: "Comes from knowing the material will be there when it's needed, not from luck on the day.",
    },
  ],
  credentials: [
    "Techniques drawn from twenty years of classroom and workshop practice.",
    "Coach mentored by global memory experts.",
    "Certificate of completion on finishing the Memory Mastery Workshop.",
  ],
  faqs: [
    {
      q: "Which program should my child start with?",
      a: "Most school students start with the Memory Mastery Workshop, then move into the Hybrid Learning Program to embed the habit. Competitive exam aspirants usually go straight to the Competitive Exam Track.",
    },
    {
      q: "Can a student switch programs later?",
      a: "Yes. Tell us the grade or exam target on WhatsApp and we'll point you to the right starting program — moving between them is normal as needs change.",
    },
    {
      q: "Do the programs replace school or tuition?",
      a: "No. They teach the study method that makes school and tuition time more effective — a skill layered on top, not a replacement for either.",
    },
  ],
} as const;

export const resultsPage = {
  eyebrow: "Results",
  heading: "Real Results. Real Transformations.",
  intro:
    "What changes when a student learns how to learn — shown through verified stories, not projected numbers.",
  categories: [
    {
      icon: "trending",
      title: "Academic improvements",
      body: "Stronger marks driven by a better study method, not longer hours.",
    },
    {
      icon: "brain",
      title: "Better retention and recall",
      body: "Students hold on to what they learn and retrieve it under exam pressure.",
    },
    {
      icon: "award",
      title: "Rank holders and exam achievements",
      body: "Aspirants carrying memory technique into competitive exam preparation.",
    },
  ],
  featuredStories: [
    {
      id: "story-1",
      placeholder: true,
      name: null as string | null,
      detail: null as string | null,
    },
    {
      id: "story-2",
      placeholder: true,
      name: null as string | null,
      detail: null as string | null,
    },
  ],
  rankHolders: [
    { id: "rank-1", placeholder: true, name: null as string | null, exam: null as string | null, rank: null as string | null },
    { id: "rank-2", placeholder: true, name: null as string | null, exam: null as string | null, rank: null as string | null },
    { id: "rank-3", placeholder: true, name: null as string | null, exam: null as string | null, rank: null as string | null },
  ],
  demonstration: {
    before: "Re-reads notes for hours, recognises the material, but freezes when asked to produce it without the book open.",
    after: "Recalls the same material on demand, using a technique built to be retrieved rather than just revisited.",
  },
} as const;

export const galleryPage = {
  eyebrow: "Gallery",
  heading: "Workshops, Academy, and Events",
  intro:
    "A look at the sessions themselves — added as we get client-approved photos and video from each one.",
  categories: ["Workshops", "Academy", "Events", "Media / Press", "Videos"] as const,
} as const;

export const testimonialsPage = {
  eyebrow: "Testimonials",
  heading: "What Parents & Students Say",
  intro: "In their own words — shared with permission from the families and students we've worked with.",
  ratingSummary: {
    value: "4.8",
    label: "Google Rating",
    detail: "From the parents and students we work with.",
  },
  groups: [
    { key: "parents", label: "Parents" },
    { key: "students", label: "Students" },
    { key: "aspirants", label: "Competitive Aspirants" },
    { key: "institutions", label: "Principals & Institutions" },
  ] as const,
} as const;

export const faqPage = {
  eyebrow: "FAQ",
  heading: "Answers to Common Questions",
  intro:
    "Grouped by what parents usually ask about first. If your question isn't here, message us on WhatsApp and we'll answer it directly.",
  groups: [
    {
      key: "programs",
      label: "Programs",
      items: [
        {
          q: "What age group are the programs for?",
          a: "The programs are built for Grade 5 and above, and for competitive exam aspirants preparing for exams such as UPSC, NEET, JEE, SSC and Banking.",
        },
        {
          q: "What does the Memory Mastery Workshop cover?",
          a: "The core memory methods — practical techniques to remember faster and retain longer, taught so they can be used the same week.",
        },
        {
          q: "Is the Competitive Exam Track different from the school program?",
          a: "Yes. It applies the same underlying memory skills specifically to the volume and recall pressure of competitive papers.",
        },
      ],
    },
    {
      key: "parents",
      label: "Parents",
      items: [
        {
          q: "How do I know if my child needs this?",
          a: "If your child studies for hours but forgets quickly, moves between tuitions without lasting improvement, or blanks in the exam hall despite understanding the material at home — that's a method problem, not an effort problem.",
        },
        {
          q: "Will I be able to track progress?",
          a: "Yes. The facilitator support built into the Hybrid Learning Program keeps a parent informed on whether the habit is sticking, not just whether a session was attended.",
        },
      ],
    },
    {
      key: "competitive",
      label: "Competitive Exams",
      items: [
        {
          q: "Is this suitable for competitive exam aspirants?",
          a: "Yes. The Competitive Exam Track applies learning and memory strategies specifically to UPSC, NEET, JEE, SSC, Banking and other exams.",
        },
        {
          q: "Does it help with recall under time pressure, not just memorisation?",
          a: "That is the specific gap it targets — recognising material while studying is not the same skill as producing it cold, under a clock, which is what the exam hall actually demands.",
        },
      ],
    },
    {
      key: "online",
      label: "Online & Hybrid Learning",
      items: [
        {
          q: "Are the sessions online or offline?",
          a: "Both. The hybrid model combines recorded lessons you can take at your own pace with live practice sessions and daily doubt clearing.",
        },
        {
          q: "How does the hybrid learning program work?",
          a: "You learn at your pace through recorded lessons, put the techniques into practice in guided live sessions, get your questions resolved in daily doubt clearing, and stay supported by a facilitator throughout.",
        },
      ],
    },
    {
      key: "fees",
      label: "Fees & Enrollment",
      items: [
        {
          q: "How do I enroll?",
          a: `Message us on WhatsApp at ${contact.whatsapp} with your child's grade or exam target, and we'll recommend the right program and next steps.`,
        },
        {
          q: "How can I speak with the team?",
          a: `Message us on WhatsApp at ${contact.whatsapp}, or call support on ${contact.support}. We are available ${contact.hours}.`,
        },
      ],
    },
  ],
} as const;

export const blogPage = {
  eyebrow: "Blog",
  heading: "Ideas on How to Study, Not Just What to Study",
  intro:
    "Short, practical reads on memory, focus and exam preparation — written for parents and students, added as new posts go live.",
  categories: [
    "Memory Techniques",
    "Study Skills",
    "Exam Preparation",
    "Parenting",
    "Speed Reading",
  ] as const,
} as const;

export const contactPage = {
  eyebrow: "Contact",
  heading: "Talk to Our Team",
  intro:
    "Tell us your child's grade or exam target and we'll point you to the right program — usually within the same conversation.",
  formFields: {
    name: "Name",
    phone: "Phone",
    target: "Child's Grade or Exam Target",
    message: "Message",
  },
} as const;

export const legalPage = {
  privacy: {
    eyebrow: "Privacy Policy",
    heading: "Privacy Policy",
    updated: "Last updated: July 2026",
  },
  terms: {
    eyebrow: "Terms & Conditions",
    heading: "Terms & Conditions",
    updated: "Last updated: July 2026",
  },
} as const;

export const footer = {
  description:
    "We don't just tell students to study. We teach them how to study effectively.",
  quickLinks: [
    { label: "Services", href: "/services" },
    { label: "Results", href: "/results" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  programs: [
    { label: "Memory Mastery Workshop", href: "/services" },
    { label: "Hybrid Learning Program", href: "/services" },
    { label: "Competitive Exam Track", href: "/services" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;
