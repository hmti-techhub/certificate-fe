"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BadgePercent,
  BookMarked,
  BookOpenText,
  Contact,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { INavMenu } from "./Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IAuthSession } from "@/lib/types/Auth";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LandingPageNavbar = ({ session }: { session: IAuthSession }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const MAX_SCROLL = 1000;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > MAX_SCROLL);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavMenu: INavMenu[] = [
    {
      id: 1,
      title: "about",
      link: "/#about",
      icon: <BookOpenText className="w-5" />,
    },
    {
      id: 2,
      title: "price",
      link: "/#price",
      icon: <BadgePercent className="w-5" />,
    },
    {
      id: 3,
      title: "contact",
      link: "/#contact",
      icon: <Contact className="w-5" />,
    },
    {
      id: 4,
      title: "docs",
      link: "/docs",
      icon: <BookMarked className="w-5" />,
    },
  ];

  return (
    <nav
      className={cn(
        "w-full py-4 bg-white z-50 transition-all duration-300",
        isScrolled && "fixed -top-1 shadow-md",
      )}
    >
      <div className="px-6 md:px-20 lg:px-40">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex flex-row justify-start items-center gap-2 hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              priority
              src="/certify/certify-logo-only-black.png"
              alt="Certify Logo"
              width={40}
              height={40}
              className="w-5 h-5"
            />
            <h1 className="font-bold text-lg uppercase">Certify</h1>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-row justify-end items-center gap-10">
            {NavMenu.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="text-sm group relative w-max"
              >
                <span className="inline-flex items-center gap-1">
                  {item.title}
                  {item.title === "docs" && <ArrowUpRight className="w-4" />}
                </span>
                <span className="absolute -bottom-2 left-0 w-0 transition-all h-[2px] bg-black group-hover:w-full"></span>
              </Link>
            ))}
            <Button
              className={cn(
                "bordered text-black flex items-center gap-2",
                session
                  ? "bg-greenn hover:bg-greenn/90"
                  : "bg-yelloww hover:bg-yelloww/90",
              )}
              onClick={() => router.push("/auth/sign-up")}
            >
              {session ? (
                session.user ? (
                  <>
                    <span>dashboard</span>
                    <LayoutDashboard />
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <LogIn />
                  </>
                )
              ) : (
                <>
                  <span>Register</span>
                  <LogIn />
                </>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
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
      {/* Mobile Menu */}
      <div
        className={`absolute ${
          isScrolled ? "top-[64px]" : "top-[70px]"
        } left-0 w-full z-50 bg-white px-4 shadow-lg rounded-b-lg transition-all duration-300 ${
          isOpen ? "opacity-100 py-4" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3">
          {NavMenu.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="block text-sm text-black px-2 py-1 hover:bg-gray-200 rounded-md transition-all"
            >
              <span className="inline-flex items-center gap-2">
                {item.icon} {item.title}
                {item.title === "docs" && <ArrowUpRight className="w-4" />}
              </span>
            </Link>
          ))}
          <Button
            className={cn(
              "bordered text-black flex items-center gap-2",
              session
                ? "bg-greenn hover:bg-greenn/90"
                : " bg-yelloww hover:bg-yelloww/90",
            )}
            onClick={() => router.push("/auth/sign-up")}
          >
            {session ? (
              session.user ? (
                <>
                  <span>Dashboard</span>
                  <LayoutDashboard />
                </>
              ) : (
                <>
                  <span>Register</span>
                  <LogIn />
                </>
              )
            ) : (
              <>
                <span>register</span>
                <LogIn />
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
