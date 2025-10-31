import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions from original frontend
export function generateCitationsHTML(citations: Array<{title: string, url: string}>) {
  if (!citations || citations.length === 0) {
    return '';
  }
  
  const citationId = 'ref-list-' + Math.random().toString(36).substr(2, 9);
  
  let html = `
    <div class="citations-section">
      <button class="references-toggle" aria-expanded="false" aria-controls="${citationId}">
        <span class="toggle-label">
          <i class="fas fa-book-medical"></i>
          <span>View Citations</span>
        </span>
        <i class="fas fa-chevron-down toggle-icon"></i>
      </button>
      <div class="references-content" id="${citationId}">
        <ul>
  `;
  
  citations.forEach(citation => {
    html += `
      <li>
        <a href="${citation.url}" target="_blank" rel="noopener">${citation.title}</a>
      </li>
    `;
  });
  
  html += '</ul></div></div>';
  return html;
}

export function extractCitations(responseText: string): Array<{title: string, url: string}> {
  const citations = [];
  const citationRegex = /For more information: \[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  
  while ((match = citationRegex.exec(responseText)) !== null) {
    citations.push({
      title: match[1],
      url: match[2]
    });
  }
  
  return citations;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Cache utilities
export class CacheManager {
  private static cache = new Map<string, { data: any; expiry: number }>();
  
  static set(key: string, data: any, ttl: number = 3600000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }
  
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  static clear(): void {
    this.cache.clear();
  }
}