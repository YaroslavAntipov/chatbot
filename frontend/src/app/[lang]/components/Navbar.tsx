"use client";
import Logo from "./Logo";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { authApi } from "@/store/api/authApi";
import { logout } from "@/store/slice/StrapiSlice";
import { useRouter, usePathname } from "next/navigation";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

interface MobileNavLink extends NavLink {
  closeMenu: () => void;
}

function NavLink({ url, text }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 ${
          path === url ? "text-blue-400 border-blue-400" : ""
        }  hover:text-blue-400`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <a className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`mx-3 block rounded-lg px-3 py-2 font-semibold leading-7 text-gray-100 ${
          path === url ? "text-blue-400 border-blue-400" : ""
        } hover:text-blue-400`}
      >
        {text}
      </Link>
    </a>
  );
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.main.isAuthenticated);
  const pathname = usePathname();

  if (pathname.includes("review")) {
    return null;
  }

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  const authLinks: Array<NavLink> = [
    { url: "/en/chatbots", text: "Chatbots", id: 123, newTab: false },
    { url: "/en/profile", text: "Profile", id: 12345, newTab: false },
  ];
  const nonAuthLinks: Array<NavLink> = [
    { url: "/en/login", text: "Login", id: 1234, newTab: false },
    { url: "/en/register", text: "Register", id: 12345, newTab: false },
  ];
  const finalLinks = isAuthenticated
    ? [...links, ...authLinks]
    : [...links, ...nonAuthLinks];

  const handleLogoutClick = (event: React.MouseEvent) => {
    event.preventDefault();

    dispatch(authApi.util.resetApiState());
    dispatch(logout());

    router.push("/en/login");
  };
  return (
    <div className="p-4 bg-black text-gray-100">
      <div className="flex justify-between h-16 mx-auto px-0 mx-5 sm:px-6">
        <Logo href={isAuthenticated ? "/en/chatbots" : "/"} src={logoUrl}>
          {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
        </Logo>

        <div className="items-center flex-shrink-0 hidden lg:flex">
          <ul className="items-stretch hidden space-x-3 lg:flex">
            {finalLinks.map((item: NavLink) => (
              <NavLink key={item.id} {...item} />
            ))}
            {isAuthenticated && (
              <button
                className="text-gray-100 hover:text-blue-400"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            )}
          </ul>
        </div>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 rtl:left-0 ltr:right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                {logoText && <span className="sr-only">{logoText}</span>}
                {logoUrl && <img className="h-8 w-auto" src={logoUrl} alt="" />}
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200/10">
                <div className="space-y-2 py-6">
                  {finalLinks.map((item) => (
                    <MobileNavLink
                      key={item.id}
                      closeMenu={closeMenu}
                      {...item}
                    />
                  ))}
                  {isAuthenticated && (
                    <button
                      className="text-gray-100 hover:text-blue-400"
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        <button
          className="p-4 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-7 w-7 text-gray-100" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
