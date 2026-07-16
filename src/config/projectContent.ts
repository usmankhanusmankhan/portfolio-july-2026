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
}

export const professionalProjects: ProjectImageEntry[] = [
  { href: "./business-development-digest.webp", id: "business-development-digest", link: "/reachoutpanel", hoverText: "here we go!!!" },
  { href: "./ai-patterns.webp", id: "ai-patterns", link: "/reachoutpanel", hoverText: "here we go!!!" },
  { href: "./embedded-celeste.webp", id: "embedded-celeste", link: "/reachoutpanel", hoverText: "here we go!!!" },
];

export const artProjects: ProjectImageEntry[] = [
  { href: "./art11.webp", id: "art11" },
  { href: "./art2.webp", id: "art2" },
  { href: "./art3.webp", id: "art3" },
  { href: "./art4.webp", id: "art4" },
  { href: "./art5.webp", id: "art5" },
  { href: "./art8.webp", id: "art8" },
  { href: "./art1.webp", id: "art1" },
  { href: "./art7.webp", id: "art7" },
  { href: "./art9.webp", id: "art9" },
  { href: "./art10.webp", id: "art10" },
];