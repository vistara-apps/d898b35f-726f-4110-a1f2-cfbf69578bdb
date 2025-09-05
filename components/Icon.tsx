'use client';

import { 
  Phone, 
  Video, 
  Mic, 
  Share2, 
  Info,
  Shield,
  User,
  Menu,
  CheckCircle,
  XCircle,
  Play,
  Square,
  X,
  LucideIcon
} from 'lucide-react';

const icons = {
  phone: Phone,
  video: Video,
  mic: Mic,
  share: Share2,
  info: Info,
  shield: Shield,
  user: User,
  menu: Menu,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  play: Play,
  square: Square,
  x: X,
} as const;

interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
}

export function Icon({ name, className = '', size = 24 }: IconProps) {
  const IconComponent = icons[name] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} size={size} />;
}
