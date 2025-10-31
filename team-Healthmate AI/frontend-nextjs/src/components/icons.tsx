import React from 'react';
import * as LucideIcons from 'lucide-react';

// Create a wrapper for Lucide icons that properly handles className
export const createLucideIcon = (IconComponent: any) => {
  return React.forwardRef<SVGSVGElement, { className?: string; [key: string]: any }>((props, ref) => {
    return <IconComponent {...props} ref={ref} />;
  });
};

// Export commonly used icons with proper className support
export const Heart = createLucideIcon(LucideIcons.Heart);
export const Menu = createLucideIcon(LucideIcons.Menu);
export const X = createLucideIcon(LucideIcons.X);
export const ChevronRight = createLucideIcon(LucideIcons.ChevronRight);
export const Stethoscope = createLucideIcon(LucideIcons.Stethoscope);
export const Lightbulb = createLucideIcon(LucideIcons.Lightbulb);
export const Book = createLucideIcon(LucideIcons.Book);
export const MessageCircle = createLucideIcon(LucideIcons.MessageCircle);
export const Phone = createLucideIcon(LucideIcons.Phone);
export const Cross = createLucideIcon(LucideIcons.Cross);
export const Building2 = createLucideIcon(LucideIcons.Building2);
export const History = createLucideIcon(LucideIcons.History);
export const Calendar = createLucideIcon(LucideIcons.Calendar);
export const Trash2 = createLucideIcon(LucideIcons.Trash2);
export const Search = createLucideIcon(LucideIcons.Search);
export const Activity = createLucideIcon(LucideIcons.Activity);
export const Clock = createLucideIcon(LucideIcons.Clock);
export const Droplets = createLucideIcon(LucideIcons.Droplets);
export const Send = createLucideIcon(LucideIcons.Send);
export const AlertTriangle = createLucideIcon(LucideIcons.AlertTriangle);
export const CheckCircle = createLucideIcon(LucideIcons.CheckCircle);
export const Loader2 = createLucideIcon(LucideIcons.Loader2);
export const User = createLucideIcon(LucideIcons.User);
export const Bot = createLucideIcon(LucideIcons.Bot);
export const Copy = createLucideIcon(LucideIcons.Copy);
export const ExternalLink = createLucideIcon(LucideIcons.ExternalLink);
export const BookOpen = createLucideIcon(LucideIcons.BookOpen);
export const RefreshCw = createLucideIcon(LucideIcons.RefreshCw);
export const Zap = createLucideIcon(LucideIcons.Zap);
export const Globe = createLucideIcon(LucideIcons.Globe);
export const MapPin = createLucideIcon(LucideIcons.MapPin);
export const ArrowRight = createLucideIcon(LucideIcons.ArrowRight);
export const Users = createLucideIcon(LucideIcons.Users);

export default {
  Heart,
  Menu,
  X,
  ChevronRight,
  Stethoscope,
  Lightbulb,
  Book,
  MessageCircle,
  Phone,
  Cross,
  Building2,
  History,
  Calendar,
  Trash2,
  Search,
  Activity,
  Clock,
  Droplets,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  User,
  Bot,
  Copy,
  ExternalLink,
  BookOpen,
  RefreshCw,
  Zap,
  Globe,
  MapPin,
  ArrowRight,
  Users
};