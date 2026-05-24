"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  PlusSquare,
  Trophy,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const menus = [
    {
      label: "Home",
      href: "/competitions",
      icon: Home,
    },
    {
      label: "Create",
      href: "/create-competition",
      icon: PlusSquare,
    },
    {
      label: "Standings",
      href: "/standings",
      icon: Trophy,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">
      <div className="flex items-center justify-around rounded-[28px] border border-white/10 bg-[#11152a]/80 px-2 py-3 backdrop-blur-2xl">
        {menus.map((menu) => {
          const isActive =
            pathname === menu.href;

          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400"
              }`}
            >
              <Icon size={20} />

              <span className="text-[11px] font-medium">
                {menu.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}