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

export const stats = [
  { icon: "users", value: "90,000+", label: "Students Trained" },
  { icon: "calendar", value: "20+", label: "Years of Experience" },
  { icon: "award", value: "45+", label: "Rank Holders" },
  { icon: "star", value: "4.8★", label: "Google Rating" },
] as const;

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
  { icon: "lightbulb", label: "Understand" },
  { icon: "brain", label: "Remember" },
  { icon: "sparkles", label: "Recall" },
  { icon: "pencil", label: "Apply" },
  { icon: "trophy", label: "Achieve" },
] as const;

export const programs = [
  {
    icon: "brain",
    title: "Memory Mastery Workshop",
    body: "Practical techniques to remember faster and retain longer.",
    audience: "Grade 5+",
  },
  {
    icon: "layers",
    title: "Hybrid Learning Program",
    body: "Recorded learning, live practice, doubt clearing, and facilitator support.",
    audience: "School Students",
  },
  {
    icon: "target",
    title: "Competitive Exam Track",
    body: "Learning and memory strategies for UPSC, NEET, JEE, SSC, Banking, and other exams.",
    audience: "Exam Aspirants",
  },
] as const;

export const hybridModel = [
  {
    icon: "play",
    title: "Learn at Your Pace",
    body: "Recorded lessons",
  },
  {
    icon: "video",
    title: "Live Practice Sessions",
    body: "Guided implementation",
  },
  {
    icon: "help",
    title: "Daily Doubt Clearing",
    body: "Get questions resolved",
  },
  {
    icon: "handshake",
    title: "Facilitator Support",
    body: "Continuous guidance",
  },
] as const;

export const coach = {
  name: "Pradeep Acharya",
  eyebrow: "Meet Your Coach",
  bio: "A Mechanical Engineer by qualification and a Memory Coach by passion, Pradeep Acharya helps students develop practical learning, memory, focus, and recall skills.",
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

/**
 * PLACEHOLDERS. Video testimonials are listed under "Assets Required From
 * Client". Drop the real thumbnail into /public/images, set `youtubeId`, fill
 * `name` + `role`, and remove `placeholder`.
 */
export const videoTestimonials = [
  {
    id: "video-1",
    placeholder: true,
    thumbnail: null as string | null,
    youtubeId: null as string | null,
    name: null as string | null,
    role: null as string | null,
  },
  {
    id: "video-2",
    placeholder: true,
    thumbnail: null as string | null,
    youtubeId: null as string | null,
    name: null as string | null,
    role: null as string | null,
  },
] as const;

/**
 * PLACEHOLDER. No written testimonial has been supplied and none may be
 * invented. Fill `quote`, `name`, `role`, drop `placeholder`.
 */
export const writtenTestimonials = [
  {
    id: "written-1",
    placeholder: true,
    quote: null as string | null,
    name: null as string | null,
    role: null as string | null,
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
