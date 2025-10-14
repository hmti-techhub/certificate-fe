"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import AuthButton from "./auth/AuthButton";
import { LogOut } from "lucide-react";
import { IAuthSession } from "@/lib/types/Auth";

export interface INavMenu {
  id: number;
  title: string;
  link: string;
  icon?: React.ReactNode;
}

const Navbar = ({
  clickable,
  session,
}: {
  clickable?: boolean;
  session?: IAuthSession;
}) => {
  const role = session?.user.roles;
  const name = session?.user.email.split("@")[0];

  const [isOpen, setIsOpen] = useState(false);
  const NavMenu: INavMenu[] = [
    { id: 1, title: "events", link: "/dashboard" },
    { id: 2, title: "profile", link: "/profile" },
    { id: 3, title: "price", link: "/#price" },
    { id: 4, title: "docs", link: "/docs" },
    { id: 5, title: "admin", link: "/admin" },
  ];

  return (
    <div className="w-full py-4 bg-white">
      <div
        className={`flex justify-between items-center   ${
          clickable ? "px-4 md:px-20 lg:px-40" : "px-0"
        }`}
      >
        <div className="flex flex-col">
          <div className="text-black text-lg font-bold">Dashboard</div>
          <div className="text-gray-500 text-xs md:text-sm">
            hi {name}, such a nice day to see you
          </div>
        </div>
        <div className="hidden md:flex gap-10">
          {NavMenu.map((item) => {
            if (!clickable)
              return (
                <span
                  key={item.id}
                  className="text-sm group relative cursor-pointer"
                >
                  <span>{item.title === "admin" ? null : item.title}</span>
                  <span className="absolute -bottom-2 left-0 w-0 transition-all h-[2px] bg-black group-hover:w-full"></span>
                </span>
              );

            if (role !== "SUPERADMIN" && item.title === "admin") return null;

            return (
              <Link
                key={item.id}
                href={item.link}
                className="text-sm group relative"
                onClick={() => setIsOpen(false)}
              >
                <span>{item.title}</span>
                <span className="absolute -bottom-2 left-0 w-0 transition-all h-[2px] bg-black group-hover:w-full"></span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-5">
          {clickable ? (
            <AuthButton mode="signOut" className="hidden md:block" />
          ) : (
            <Button className="bordered w-full bg-redd hover:bg-redd/90 text-black">
              log out
              <LogOut />
            </Button>
          )}
          <button
            className="md:hidden flex flex-col space-y-1.5 p-2 "
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "rotate-45 translate-y-2 " : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div
        className={`absolute top-[70px] left-0 w-full z-50 bg-white px-4 shadow-lg rounded-b-lg transition-all duration-300 ${
          isOpen ? "opacity-100 py-4" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3">
          {NavMenu.map((item) => {
            if (role !== "SUPERADMIN" && item.title === "admin") return null;
            return (
              <Link
                key={item.id}
                href={item.link}
                className="block text-sm text-black py-1 hover:bg-gray-200 rounded-md transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
        <AuthButton mode="signOut" className="mt-2" />
      </div>
    </div>
  );
};

export default Navbar;
