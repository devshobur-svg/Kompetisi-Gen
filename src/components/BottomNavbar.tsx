"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Home,
  Trophy,
  PlusSquare,
  User,
} from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const menus = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "League",
      href: "/competitions",
      icon: Trophy,
    },
    {
      label: "Create",
      href: "/create-competition",
      icon: PlusSquare,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[92%]
        max-w-md
        z-50
      "
    >
      <div
        className="
          bg-[#11162a]/90
          backdrop-blur-2xl
          border
          border-white/10
          rounded-3xl
          px-3
          py-3
          flex
          justify-between
          shadow-2xl
        "
      >
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                flex-1
              "
            >
              <div
                className={`
                  w-12
                  h-12
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-transparent"
                  }
                `}
              >
                <Icon size={20} />
              </div>

              <div
                className={`
                  text-[11px]
                  ${
                    active
                      ? "text-white"
                      : "text-white/50"
                  }
                `}
              >
                {menu.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}