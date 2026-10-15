export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/pires-cerullo/",
  github: "https://github.com/piresc",
  medium: "https://medium.com/@piresc.dev",
  behance: "https://www.behance.net/piresc",
  instagram: "https://www.instagram.com/piresc.capture/",
  email: "mailto:piresc.dev@gmail.com",
  cv: "/piresc-cv.pdf"
};

export const socialProfiles = [
  { name: 'LinkedIn', href: socialLinks.linkedin },
  { name: 'GitHub', href: socialLinks.github },
  { name: 'Medium', href: socialLinks.medium },
  { name: 'Behance', href: socialLinks.behance },
  { name: 'Instagram', href: socialLinks.instagram },
] as const;

export const launchpadSites = [
  { name: 'score', href: 'https://score.piresc.dev' },
  { name: 'assetpulse', href: 'https://assetpulse.piresc.dev' },
  { name: 'peraturanku', href: 'https://peraturanku.piresc.dev' },
  { name: 'jellyfin', href: 'https://jellyfin.piresc.dev' },
  { name: 'files', href: 'https://files.piresc.dev' },
] as const;
