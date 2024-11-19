"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const FeatureList = [
  {
    title: "home",
    url: "/",
  },
  {
    title: "history",
    url: "/transactions-history",
  },
];
export function FeaturesNavbar() {
  const currentPath = usePathname();
  return (
    <div className="ml-8 flex w-full justify-end gap-2 py-2">
      {FeatureList.map((feature, index) => (
        <Link
          key={index}
          href={feature.url}
          className={`flex w-36 items-center justify-center text-center text-lg focus:outline-none ${
            currentPath.includes(feature.url)
              ? "font-medium text-orange-500 underline"
              : "text-black"
          }`}
        >
          <h2>{feature.title}</h2>
        </Link>
      ))}
    </div>
  );
}

export function FeaturesNavbarMobile() {
  const currentPath = usePathname();

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center justify-center rounded-lg border-2 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-orange-200 focus:outline-none">
        {({ open }) => (
          <>
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </>
        )}
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-24 origin-top-right rounded-xl border-2 border-black bg-white p-2 shadow-lg focus:outline-none">
        {FeatureList.map((feature, index) => (
          <MenuItem key={index}>
            <Link
              href={feature.url}
              className={`block rounded-lg px-4 py-2 text-lg ${
                currentPath.includes(feature.url)
                  ? "font-medium text-orange-500 underline"
                  : ""
              }`}
            >
              {feature.title}
            </Link>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
