import { siteConfig } from "../data/siteConfig";
import "./SiteHeader.css";

interface SiteHeaderProps {
  generatedAt: string;
  projectCount: number;
}

export function SiteHeader({ generatedAt, projectCount }: SiteHeaderProps) {
  const refreshedOn = new Date(generatedAt).toLocaleDateString(undefined, { dateStyle: "long" });
  return (
    <header className="site-header">
      <h1 className="site-header__title">{siteConfig.name}</h1>
      <p className="site-header__tagline">{siteConfig.tagline}</p>
      <p className="site-header__edition">
        {projectCount} routes. Surveyed from GitHub on {refreshedOn}, resurveyed weekly.
      </p>
    </header>
  );
}
