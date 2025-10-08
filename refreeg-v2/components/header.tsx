"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { useAdmin } from "@/hooks/use-admin";
import {
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  Megaphone,
  FileText,
  Info,
  LogOut,
  HeartHandshake,
  Users,
  Globe,
  BookOpen,
  Lightbulb,
  Target,
  CircleDollarSign,
  TargetIcon,
  Heart,
  BarChart3,
  Shield,
  Book,
  Star,
  Rocket,
  HelpCircle,
  Calendar,
  MapPin,
  Users2,
  Globe2,
  LightbulbIcon,
  Search,
  Sparkles,
  PlayCircle,
  HandHeart,
} from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button as HeroButton,
} from "@heroui/react";

// Define types for navigation items
interface NavLink {
  title: string;
  type: "link";
  href: string;
}

interface NavDropdown {
  icon: React.ComponentType<any>;
  header: string;
  title: string;
  type: "dropdown";
  items: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<any>;
  }>;
}

type NavItem = NavLink | NavDropdown;

export function Header() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const { isAdminOrManager } = useAdmin(user?.id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      title: "Explore Causes",
      href: "/causes",
      type: "link",
    },
    {
      title: "What can I crowdfund?",
      header: "Curious about what you crowdfund for? Here are some ideas:",
      icon: HandHeart,
      type: "dropdown",
      items: [
        {
          title: "🌍 Refreeg for Businesses",
          description:
            "Empower your brand with purpose. Launch CSR campaigns, support community-driven causes, and connect with customers who care about impact.",
          href: "/businesses",
          icon: CircleDollarSign,
        },
        {
          title: "🤝 RefreeG for Nonprofits",
          description:
            "Raise more, reach more. Build trust with transparent fundraising tools designed to help nonprofits thrive and grow their donor communities.",
          href: "/nonprofits",
          icon: Target,
        },
        {
          title: "🌪️ RefreeG for Disaster Relief",
          description:
            "Respond faster when it matters most. Rally urgent support for communities hit by disasters and get aid to those who need it — quickly and securely.",
          href: "/disaster-relief",
          icon: FileText,
        },
        {
          title: "🎨 RefreeG for Creators",
          description:
            "Turn your influence into impact. Get your unique tag, share your story, and receive donations directly from your fans — in fiat or crypto.",
          href: "/creators",
          icon: FileText,
        },
        {
          title: "🏥 RefreeG for Healthcare",
          description:
            "Give hope a platform. Raise funds for medical bills, healthcare projects, or critical treatments — with transparency and community support.",
          href: "/healthcare",
          icon: FileText,
        },
      ],
    },
    {
      title: "How RefreeG works",
      header: "How can you crowdfund on RefreeG?",
      icon: Lightbulb,
      type: "dropdown",
      items: [
        {
          title: "⭐ How to start a cause",
          description:
            "Starting causes is easy, and fast because of the intuitive user experience Refreeg is built on. Set up causes in less than 3 minutes!",
          href: "/crowdfund/medical",
          icon: Star,
        },
        {
          title: "🚀 Crowdfunding tips",
          description:
            "Raise more, reach more. Build trust with transparent fundraising tools.",
          href: "/crowdfund/education",
          icon: Rocket,
        },
        {
          title: "📢 For Supporters",
          description:
            "See how to discover causes, donate securely in fiat or crypto, and follow progress transparently.",
          href: "/crowdfund/community",
          icon: Users,
        },
        {
          title: "💸 Fees & Payouts",
          description:
            "Clear explanation of transaction fees, payout timelines, and how creators/nonprofits access their funds.",
          href: "/crowdfund/fees",
          icon: CircleDollarSign,
        },
        {
          title: "🛡️ Trust & Safety",
          description:
            "Read about our fraud checks, KYC verification, and commitment to protecting both donors and cause.",
          href: "/crowdfund/trust",
          icon: Shield,
        },
        {
          title: "📣 FAQ",
          description:
            "Get answers to the most common questions about crowdfunding on RefreeG.",
          href: "/crowdfund/faq",
          icon: HelpCircle,
        },
      ],
    },
    {
      title: "About RefreeG",
      header: "About RefreeG?",
      icon: Lightbulb,
      type: "dropdown",
      items: [
        {
          title: "💼Our Mission",
          description: "Find out what our mission here at RefreeG.",
          href: "/about-us/OurMission",
          icon: TargetIcon,
        },
        {
          title: "📢Our Story",
          description:
            "Raise more, reach more. Build trust with transparent fundraising tools.",
          href: "/about-us/OurStory",
          icon: Book,
        },
        {
          title: "🔨Our Impact",
          description:
            "See how to discover causes, donate securely in fiat or crypto, and follow progress transparently.",
          href: "/about-us/OurImpact",
          icon: BarChart3,
        },
        {
          title: "🧑‍🤝‍🧑Who Are We Made By",
          description:
            "Clear explanation of transaction fees, payout timelines, and how creators/nonprofits access their funds.",
          href: "/about-us/OurTeam",
          icon: Users2,
        },
        {
          title: "💡 What We Do",
          description:
            "Read about our fraud checks, KYC verification, and commitment to protecting both donors and cause.",
          href: "/about-us/WhatWeDo",
          icon: LightbulbIcon,
        },
        {
          title: "📣FAQ",
          description:
            "Get answers to the most common questions about crowdfunding on RefreeG.",
          href: "/about-us/faq",
          icon: Heart,
        },
      ],
    },
  ];

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50">
        <Navbar
          isBordered
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:p-4"
        >
          <div className="flex items-center justify-between w-full">
            {/* Left: Logo + Desktop Nav */}
            <div className="flex items-center gap-4">
              <NavbarBrand>
                <Logo />
              </NavbarBrand>

              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-0 items-center">
                {navItems.map((item) => {
                  if (item.type === "link") {
                    return (
                      <NavbarItem
                        key={item.href}
                        isActive={pathname === item.href}
                      >
                        <Link
                          href={item.href}
                          className={`text-sm font-medium transition-colors hover:text-secondary px-3 py-2 rounded-md ${
                            pathname === item.href
                              ? "text-foreground bg-primary/10"
                              : "text-muted-foreground hover:bg-gray-100"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </NavbarItem>
                    );
                  } else {
                    return (
                      <NavbarItem key={item.title}>
                        <Dropdown>
                          <DropdownTrigger>
                            <HeroButton
                              variant="light"
                              className="text-sm items-center font-medium text-muted-foreground hover:text-secondary hover:bg-gray-100 px-3 py-2 rounded-md transition-all duration-200 group"
                              endContent={
                                <ChevronDown className="text-small transition-transform duration-200 group-hover:rotate-180" />
                              }
                            >
                              {item.title}
                            </HeroButton>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label={item.title}
                            className="bg-white shadow-xl rounded-lg w-3/5 border border-gray-100"
                          >
                            <DropdownSection
                              title={
                                <div className="flex items-center gap-2">
                                  <div className="p-3 border border-1 bg-[#E8E8E8] rounded-full">
                                    <item.icon className="h-6 w-6" />
                                  </div>
                                  {item.header}
                                </div>
                              }
                              classNames={{
                                heading:
                                  "font-semibold text-sm text-foreground px-4 py-3 flex items-center gap-2",
                              }}
                              showDivider
                            >
                              {item.items.map((dropdownItem) => {
                                const DropdownIcon = dropdownItem.icon;
                                return (
                                  <DropdownItem
                                    key={dropdownItem.href}
                                    className="py-3 px-4 transition-all duration-200 hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 cursor-pointer"
                                    textValue={dropdownItem.title}
                                  >
                                    <Link
                                      href={dropdownItem.href}
                                      className="flex items-start gap-3 w-full group"
                                    >
                                      {/* <DropdownIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-600 transition-colors" /> */}
                                      <div className="flex-1">
                                        <p className="font-medium text-sm group-hover:text-blue-700 transition-colors">
                                          {dropdownItem.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 group-hover:text-gray-600 transition-colors">
                                          {dropdownItem.description}
                                        </p>
                                      </div>
                                      <ChevronDown className="h-4 w-4 text-transparent group-hover:text-blue-400 -rotate-90 transition-all" />
                                    </Link>
                                  </DropdownItem>
                                );
                              })}
                            </DropdownSection>
                          </DropdownMenu>
                        </Dropdown>
                      </NavbarItem>
                    );
                  }
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Link href="/dashboard/causes/create">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    
                    List a Cause
                  </Button>
                </Link>       
              </div>

              {/* Auth */}
              {!isLoading && !user ? (
                <Link href="/auth/signin">
                  <Button size="sm" variant="default">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <UserNav />
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-foreground hover:bg-gray-100 rounded-md transition-colors md:hidden"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </Navbar>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-[64px] left-0 right-0 bottom-0
    bg-background/70 
    backdrop-blur-md 
    supports-[backdrop-filter]:bg-background/60 
    border-b shadow-lg z-40 transition-all duration-300 ease-in-out
    ${
      isMenuOpen
        ? "opacity-100 translate-y-0 visible"
        : "opacity-0 -translate-y-4 invisible"
    }
  `}
        >
          <div className="container py-6 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Main Nav */}
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center py-3 px-2 text-foreground hover:text-blue-600 hover:bg-blue-600/5 rounded-md transition-all duration-200 ${
                        pathname === item.href
                          ? "text-blue-600 font-medium bg-blue-600/10"
                          : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  );
                } else {
                  return (
                    <div key={item.title} className="border-t pt-4">
                      <button
                        className="w-full flex justify-between items-center py-3 px-2 text-foreground font-medium hover:bg-blue-600/5 rounded-md transition-colors"
                        onClick={() => toggleDropdown(item.title)}
                      >
                        {item.title}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openDropdown === item.title
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openDropdown === item.title
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {/* Mobile Dropdown Header with Icon */}
                        <div className="ml-4 mt-2 mb-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md">
                          <item.icon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            {item.header}
                          </span>
                        </div>

                        <div className="ml-4 space-y-3">
                          {item.items.map((subItem) => {
                            const Icon = subItem.icon;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block py-2 px-3 text-sm hover:text-blue-600 hover:bg-blue-600/5 rounded-md transition-all duration-200"
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">
                                      {subItem.title}
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {/* Actions */}
            <div className="border-t pt-4 space-y-2">
              <Link
                href="/dashboard/causes/create"
                className="flex items-center gap-3 py-3 px-2 text-foreground hover:text-blue-600 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Megaphone className="h-4 w-4" />
                List a Cause
              </Link>

              <Link
                href="/dashboard/petitions/create"
                className="flex items-center gap-3 py-3 px-2 text-foreground hover:text-blue-600 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Create a Petition
              </Link>

              {!isLoading && user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 py-3 px-2 text-foreground hover:text-blue-600 rounded-md transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              {!isLoading && user && (
                <button
                  onClick={() => {
                    signOut?.();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full py-3 px-2 text-foreground hover:text-red-600 rounded-md transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>

            {/* Admin Links */}
            {isAdminOrManager && (
              <div className="border-t pt-4">
                <div className="py-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </div>
                <div className="space-y-1">
                  {[
                    {
                      href: "/dashboard/admin/causes",
                      title: "Manage Causes",
                      icon: Megaphone,
                    },
                    {
                      href: "/dashboard/admin/petitions",
                      title: "Manage Petitions",
                      icon: FileText,
                    },
                    {
                      href: "/dashboard/admin/users",
                      title: "Manage Users",
                      icon: Users,
                    },
                    {
                      href: "/dashboard/admin/analytics",
                      title: "Analytics",
                      icon: BarChart3,
                    },
                    {
                      href: "/dashboard/admin/logs",
                      title: "Logs",
                      icon: Book,
                    },
                  ].map((adminItem) => {
                    const AdminIcon = adminItem.icon;
                    return (
                      <Link
                        key={adminItem.href}
                        href={adminItem.href}
                        className="flex items-center gap-3 py-2 px-2 text-sm text-foreground hover:text-blue-600 hover:bg-blue-600/5 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <AdminIcon className="h-4 w-4" />
                        {adminItem.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
