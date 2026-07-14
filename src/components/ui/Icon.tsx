import {
  Award,
  Brain,
  CalendarDays,
  Globe2,
  Handshake,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageCircleQuestion,
  Pencil,
  Play,
  Repeat,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

/**
 * One icon library, one lookup. Content files reference icons by key so they
 * never import from lucide directly.
 */
const icons = {
  award: Award,
  brain: Brain,
  calendar: CalendarDays,
  globe: Globe2,
  handshake: Handshake,
  help: HelpCircle,
  layers: Layers,
  lightbulb: Lightbulb,
  pencil: Pencil,
  play: Play,
  question: MessageCircleQuestion,
  refresh: RotateCcw,
  repeat: Repeat,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trending: TrendingUp,
  trophy: Trophy,
  users: Users,
  video: Video,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Glyph = icons[name];
  return <Glyph className={className} strokeWidth={strokeWidth} aria-hidden />;
}
