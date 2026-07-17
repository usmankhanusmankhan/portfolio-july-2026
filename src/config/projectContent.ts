// Ordered lists of images for each row in the projects canvas.
// To add a new professional project or piece of art, add an entry here
// (and its size in imageConfig.ts) -- layout/positioning is handled
// automatically in ProjectsPage.tsx.

export interface ProjectImageEntry {
  href: string;
  id: string;
  // Optional dedicated route to navigate to on click. If omitted, the
  // gallery falls back to the art lightbox route (/art/:id).
  link?: string;
  // Optional text shown in the hover pill. If omitted, the gallery falls
  // back to artContent.json's title for that id, then the raw id.
  hoverText?: string;
  // 'video' renders href as a looping muted <video> clip instead of a
  // static image. Defaults to 'image' if omitted.
  mediaType?: 'image' | 'video';
}

export const professionalProjects: ProjectImageEntry[] = [
  { href: "./business-development-digest.webp", id: "business-development-digest", link: "/reachoutpanel", hoverText: "here we go!!!" },
  { href: "./ai-patterns.webp", id: "ai-patterns", link: "/reachoutpanel", hoverText: "here we go!!!" },
  { href: "./embedded-celeste.webp", id: "embedded-celeste", link: "/reachoutpanel", hoverText: "here we go!!!" },
];

export const experimentalProjects: ProjectImageEntry[] = [
  { href: "./usmans-reading-journal.webm", id: "usmans-reading-journal", link: "https://usmankhanusmankhan.github.io/reading-journal/", hoverText: "reading journal", mediaType: "video" },
];

export const artProjects: ProjectImageEntry[] = [
  { href: "./art1.webp", id: "art1" },
  { href: "./art2.webp", id: "art2" },
  { href: "./art5.webp", id: "art5" },
  { href: "./art8.webp", id: "art8" },
  { href: "./art11.webp", id: "art11" },
  { href: "./art7.webp", id: "art7" },
  { href: "./art9.webp", id: "art9" },
];