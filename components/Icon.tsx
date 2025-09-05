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
  Check,
  X,
  Square,
  Play,
  FileText,
  Download
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
  check: Check,
  x: X,
  square: Square,
  play: Play,
  fileText: FileText,
  download: Download
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
}

export function Icon({ name, className = '', size = 24 }: IconProps) {
  const IconComponent = icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent className={className} size={size} />;
}
