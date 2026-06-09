import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Profile {
  name: string;
  first_name: string;
  title: { pt: string; en: string };
  specialty: { pt: string; en: string };
  location: string;
  experience_years: number;
  bio: { pt: string; en: string };
  roles: { pt: string[]; en: string[] };
  status_cards: Array<{ pt: string; en: string; icon: string; link: string }>;
  socials: Record<string, string>;
  stats: Record<string, number>;
  certifications: string[];
  gde_status: { pt: string; en: string };
  avatar: string;
  avatar_serious: string;
  avatar_speaking: string;
}

export interface TimelineItem {
  id: string;
  company: string;
  logo: string;
  position: { pt: string; en: string };
  period: { pt: string; en: string };
  period_start: string;
  period_end: string | null;
  location: string;
  current: boolean;
  description: { pt: string; en: string };
  highlights: { pt: string[]; en: string[] };
  stack: string[];
  color: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: { pt: string; en: string };
  description: { pt: string; en: string };
  role: string;
  year: number;
  status: 'completed' | 'active' | 'in_development';
  stack: string[];
  highlights: { pt: string[]; en: string[] };
  metrics: Record<string, string>;
  links: { live: string | null; github: string | null; case_study: string | null };
  cover_image: string | null;
  gallery: string[];
  color_accent: string;
  featured: boolean;
}

export interface Article {
  id: string;
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  platform: string;
  date: string;
  reading_time: number;
  tags: string[];
  url: string;
  thumbnail: string | null;
  featured: boolean;
  type?: 'internal' | 'external';
  slug?: string;
  cover?: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  date: string;
  reading_time: number;
  tags: string[];
  cover: string | null;
  content_pt: string;
  content_en: string;
}

export interface SpeakingItem {
  id: string;
  title: { pt: string; en: string };
  event: string;
  type: string;
  date: string;
  location: string;
  description: { pt: string; en: string };
  topics: { pt: string[]; en: string[] };
  tags: string[];
  paid: boolean;
  year: number;
  image: string | null;
  slides: string | null;
  video: string | null;
  photos?: string[];
}

export interface CommunityItem {
  id: string;
  organization: string;
  logo: string;
  role: { pt: string; en: string };
  period: { pt: string; en: string };
  category: { pt: string; en: string };
  description: { pt: string; en: string };
  metrics: Array<{ label: { pt: string; en: string }; value: string }>;
  links: Record<string, string>;
  color: string;
  featured: boolean;
  coordinates: { lat: number; lng: number };
}

export interface StackItem {
  name: string;
  icon: string;
  proficiency: number;
  years: number;
  connections: string[];
}

export interface StackCategory {
  id: string;
  label: { pt: string; en: string };
  items: StackItem[];
}

export interface StackData {
  categories: StackCategory[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  private _profile = signal<Profile | null>(null);
  private _timeline = signal<TimelineItem[]>([]);
  private _projects = signal<Project[]>([]);
  private _articles = signal<Article[]>([]);
  private _speaking = signal<SpeakingItem[]>([]);
  private _community = signal<CommunityItem[]>([]);
  private _stack = signal<StackData | null>(null);
  private _blogPost = signal<BlogPost | null>(null);
  private _blogPostLoading = signal(false);

  profile = this._profile.asReadonly();
  timeline = this._timeline.asReadonly();
  projects = this._projects.asReadonly();
  articles = this._articles.asReadonly();
  speaking = this._speaking.asReadonly();
  community = this._community.asReadonly();
  stack = this._stack.asReadonly();
  blogPost = this._blogPost.asReadonly();
  blogPostLoading = this._blogPostLoading.asReadonly();

  loadAll(): void {
    this.loadProfile();
    this.loadTimeline();
    this.loadProjects();
    this.loadArticles();
    this.loadSpeaking();
    this.loadCommunity();
    this.loadStack();
  }

  loadProfile(): void {
    this.http.get<Profile>('/assets/data/profile.json').subscribe(
      data => this._profile.set(data)
    );
  }

  loadTimeline(): void {
    this.http.get<TimelineItem[]>('/assets/data/timeline.json').subscribe(
      data => this._timeline.set(data)
    );
  }

  loadProjects(): void {
    this.http.get<Project[]>('/assets/data/projects.json').subscribe(
      data => this._projects.set(data)
    );
  }

  loadArticles(): void {
    this.http.get<Article[]>('/assets/data/articles.json').subscribe(
      data => this._articles.set(data)
    );
  }

  loadSpeaking(): void {
    this.http.get<SpeakingItem[]>('/assets/data/speaking.json').subscribe(
      data => this._speaking.set(data)
    );
  }

  loadCommunity(): void {
    this.http.get<CommunityItem[]>('/assets/data/community.json').subscribe(
      data => this._community.set(data)
    );
  }

  loadStack(): void {
    if (this._stack()) return;
    this.http.get<StackData>('/assets/data/stack.json').subscribe(
      data => this._stack.set(data)
    );
  }

  loadBlogPost(slug: string): void {
    this._blogPost.set(null);
    this._blogPostLoading.set(true);
    this.http.get<BlogPost>(`/assets/data/blog/${slug}.json`).subscribe({
      next: data => { this._blogPost.set(data); this._blogPostLoading.set(false); },
      error: () => this._blogPostLoading.set(false)
    });
  }
}
