// components/social-media.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type SocialMediaPlatform = "twitter" | "facebook" | "instagram" | "linkedin";

interface SocialMediaProps {
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  className?: string;
  mode?: "display" | "edit";
  onChange?: (platform: SocialMediaPlatform, value: string) => void;
}

const platformConfig = {
  twitter: {
    label: "Twitter",
    placeholder: "https://twitter.com/username",
    domain: "twitter.com"
  },
  facebook: {
    label: "Facebook",
    placeholder: "https://facebook.com/username",
    domain: "facebook.com"
  },
  instagram: {
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    domain: "instagram.com"
  },
  linkedin: {
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    domain: "linkedin.com"
  },
} as const;

export function SocialMedia({
  twitter,
  facebook,
  instagram,
  linkedin,
  className = "flex flex-col gap-2",
  mode = "display",
  onChange,
}: SocialMediaProps) {
  const [errors, setErrors] = useState<Record<SocialMediaPlatform, string>>({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: ""
  });

  if (mode === "edit" && !onChange) {
    throw new Error("onChange is required when mode is 'edit'");
  }

  const validateUrl = (platform: SocialMediaPlatform, value: string): boolean => {
    if (!value) return true;
    
    try {
      // Check if URL starts with http:// or https://
      if (!/^https?:\/\//i.test(value)) {
        setErrors(prev => ({
          ...prev,
          [platform]: "URL must start with http:// or https://"
        }));
        return false;
      }

      // Check if URL contains the correct domain
      const url = new URL(value);
      if (!url.hostname.includes(platformConfig[platform].domain)) {
        setErrors(prev => ({
          ...prev,
          [platform]: `URL must contain ${platformConfig[platform].domain}`
        }));
        return false;
      }

      setErrors(prev => ({ ...prev, [platform]: "" }));
      return true;
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        [platform]: "Please enter a valid URL"
      }));
      return false;
    }
  };

  const handleChange = (platform: SocialMediaPlatform, value: string) => {
    if (validateUrl(platform, value)) {
      onChange?.(platform, value);
    }
  };

  const platforms = [
    { name: "twitter", value: twitter },
    { name: "facebook", value: facebook },
    { name: "instagram", value: instagram },
    { name: "linkedin", value: linkedin },
  ] as const;

  if (mode === "display") {
    return (
      <div className={className}>
        {platforms.map((platform) => {
          if (!platform.value) return null;
          return (
            <Link
              key={platform.name}
              href={platform.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {platformConfig[platform.name].label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform) => {
        const config = platformConfig[platform.name];
        return (
          <div key={platform.name} className="space-y-2">
            <label htmlFor={platform.name} className="block text-sm font-medium">
              {config.label}
            </label>
            <input
              id={platform.name}
              name={platform.name}
              type="url"
              placeholder={config.placeholder}
              value={platform.value || ""}
              onChange={(e) => handleChange(platform.name, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors[platform.name] && (
              <p className="text-sm text-red-500">{errors[platform.name]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}