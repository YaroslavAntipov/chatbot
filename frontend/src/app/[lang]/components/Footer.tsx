"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";
import { useAppSelector } from "@/store/hook";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
}

interface CategoryLink {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

function FooterLink({ url, text }: FooterLink) {
  const path = usePathname();
  return (
    <li className="flex">
      <Link
        href={url}
        className={`hover:text-blue-400 ${path === url && "text-blue-400 border-blue-400"
          }}`}
      >
        {text}
      </Link>
    </li>
  );
}

function CategoryLink({ attributes }: CategoryLink) {
  return (
    <li className="flex">
      <Link
        href={`/blog/${attributes.slug}`}
        className="hover:text-blue-400"
      >
        {attributes.name}
      </Link>
    </li>
  );
}

function RenderSocialIcon({ social }: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite />;
    case "TWITTER":
      return <AiFillTwitterCircle />;
    case "YOUTUBE":
      return <AiFillYoutube />;
    case "DISCORD":
      return <FaDiscord />;
    default:
      return null;
  }
}

export default function Footer({
  logoUrl,
  logoText,
  menuLinks,
  categoryLinks,
  legalLinks,
  socialLinks,
}: {
  logoUrl: string | null;
  logoText: string | null;
  menuLinks: Array<FooterLink>;
  categoryLinks: Array<CategoryLink>;
  legalLinks: Array<FooterLink>;
  socialLinks: Array<FooterLink>;
}) {
  const isAuthenticated = useAppSelector(state => state.main.isAuthenticated)
  const pathname = usePathname();

  if (pathname.includes("review")) {
    return null;
  }
  
  const authMenuLinks: Array<FooterLink> = [{ url: '/en/chatbots', text: 'Chatbots', id: 1234, newTab: false }, { url: '/en/profile', text: 'Profile', id: 12345, newTab: false }];
  const nonAuthMenuLinks: Array<FooterLink> = [{ url: '/en/login', text: 'Login', id: 1234, newTab: false }, { url: '/en/register', text: 'Register', id: 12345, newTab: false }];
  const finalMenuLinks = isAuthenticated ? [...menuLinks, ...authMenuLinks] : [...menuLinks, ...nonAuthMenuLinks]
  
  return (
    <footer className="py-6 bg-black text-gray-50">
      <div className="px-8 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
        <div className="flex justify-between">
          <div className="pb-6 pl-10 md:pb-0">
            <Logo href={isAuthenticated ? '/en/chatbots' : '/'} src={logoUrl}>
              {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
            </Logo>
          </div>

          {Boolean(categoryLinks?.length) && <div className="text-center md:text-left">
            <p className="pb-1 text-lg font-medium">Categories</p>
            <ul>
              {categoryLinks.map((link: CategoryLink) => (
                <CategoryLink key={link.id} {...link} />
              ))}
            </ul>
          </div>}

          <div className="text-center md:text-left pr-10">
            <p className="pb-1 text-lg font-medium">Menu</p>
            <ul>
              {finalMenuLinks.map((link: FooterLink) => (
                <FooterLink key={link.id} {...link} />
              ))}
            </ul>
          </div>
        </div>
        <div className="grid justify-center pt-6 mx-8 lg:justify-between">
          <div className="flex">
            <span className="mr-2">
              ©{new Date().getFullYear()} All rights reserved
            </span>
            <ul className="flex">
              {legalLinks.map((link: FooterLink) => (
                <Link
                  href={link.url}
                  className="text-gray-400 hover:text-gray-300 mr-2"
                  key={link.id}
                >
                  {link.text}
                </Link>
              ))}
            </ul>
          </div>
          <div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
            {socialLinks.map((link: FooterLink) => {
              return (
                <a
                  key={link.id}
                  rel="noopener noreferrer"
                  href={link.url}
                  title={link.text}
                  target={link.newTab ? "_blank" : "_self"}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-gray-900"
                >
                  <RenderSocialIcon social={link.social} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
