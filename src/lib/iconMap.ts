import {
  Users,
  BookOpen,
  Code,
  Calculator,
  Bot,
  Book,
  BookMarked,
  ThumbsUp,
  Award,
  PenTool,
  GraduationCap,
  Rocket,
  Gamepad2,
  Lightbulb,
  Brain,
  Microscope,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';

const map: Record<string, any> = {
  Users,
  BookOpen,
  Code,
  Calculator,
  Bot,
  Book,
  BookMarked,
  ThumbsUp,
  Award,
  PenTool,
  GraduationCap,
  Rocket,
  Gamepad2,
  Lightbulb,
  Brain,
  Microscope,
  Shield,
  Sparkles,
  Star,
};

export function getIconComponent(name: string): any {
  return map[name] || Users;
}


