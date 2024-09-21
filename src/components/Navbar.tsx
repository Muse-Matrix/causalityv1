"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useActiveLink } from "../hooks/useActiveLink";
import { navItems } from "@/utils/constant";
import { useRouter, usePathname } from "next/navigation";
import { useWeb3Auth } from "@/hooks/Web3AuthContext";
import { UserIcon } from "lucide-react"; 

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeItem } = useActiveLink();
  const router = useRouter();
  const pathname = usePathname();
  const { loggedIn, login, logout } = useWeb3Auth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Trigger login automatically if not logged in
  useEffect(() => {
    if (!loggedIn) {
      login();
    }
  }, [loggedIn, login]);

  // Redirect if already logged in
  useEffect(() => {
    if (loggedIn && (pathname === "/" || pathname === "/playground")) {
      router.push("/playground/record");
    }
  }, [loggedIn, pathname, router]);

  return (
    <header className="w-full">
      <nav className="bg-black text-white px-4 py-4 sm:px-8 sm:py-4 flex justify-between items-center border-b-1 border-b-white/50 relative">
        <div className="text-lg">causality.network</div>

        {/* Hamburger Button */}
        <button
          className="block sm:hidden text-white focus:outline-none relative z-30"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Navigation Items */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-75 z-20 transition-transform transform ${
            isMenuOpen ? "translate-x-0 pt-20" : "translate-x-full"
          } sm:relative sm:translate-x-0 sm:bg-transparent sm:flex sm:items-center sm:space-x-8 text-sm p-4 sm:p-0 space-y-4 sm:space-y-0`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`hover:text-primary py-2 transition-colors ${
                  activeItem === item.name ? "text-primary" : ""
                }`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}

            {/* Show avatar if logged in, otherwise show Login button */}
            {loggedIn ? (
              <div className="flex items-center space-x-4">
                <UserIcon className="text-white w-8 h-8" />
                <button
                  className="bg-lightBlue text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                  onClick={logout}
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                className="bg-lightBlue text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                onClick={login}
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
