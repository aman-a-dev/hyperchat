"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Menu, X, ArrowRight, Home, Info, Phone, Banknote } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icon/icons";
import { ThemeToggleButton } from "@/components/shared/theme-toggler-button";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bitshow } from "@/components/font/font";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: <Home /> },
  { name: "Contact", href: "/contact", icon: <Phone /> },
  { name: "About", href: "/about", icon: <Banknote /> },
  { name: "Features", href: "/features", icon: <Info /> },
];

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const { data: session } = authClient.useSession();
  // const session = {
  //   user: {
  //     name: "Amanuel Antenh",
  //     email: "amanuelantenha@gmail.com",
  //     image: "/avatar.png",
  //   },
  // };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const icon =
    theme === "system" ? (
      resolvedTheme === "dark" ? (
        <Moon />
      ) : (
        <Sun />
      )
    ) : theme === "dark" ? (
      <Moon />
    ) : (
      <Sun />
    );
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 
                   "bg-transparent"
            `}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <div className="flex items-center  gap-3">
                <Link
                  prefetch={false}
                  href="/"
                  className="flex items-center space-x-3"
                >
                  <div className="flex items-center gap-1">
                    <Logo size={60} />
                    <h1 className={`${Bitshow.className}`}>Hyperchat</h1>
                  </div>
                </Link>
              </div>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-muted absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              variants={itemVariants}
            >
              <Button>
                <Label htmlFor="themeBtn">{icon}</Label>
              </Button>
              <ThemeToggleButton
                variant="circle"
                start="center"
                className="hidden"
              />
              {session ? (
                <DropdownMenu asChild>
                  <DropdownMenuTrigger>
                    <Avatar className="w-14 h-14">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback>
                        {session.user.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <Link href="/profile">
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My account</DropdownMenuLabel>
                      <DropdownMenuItem>{session.user.name}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link
                        href="/profile"
                        className="pt-1 flex justify-between items-center"
                      >
                        <DropdownMenuItem>
                          {session.user.email}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Link href="/">
                          <Button
                            onClick={() => authClient.signOut()}
                            type="button"
                            clasw-ful="w-full"
                          >
                            Sign Out
                          </Button>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </Link>
                </DropdownMenu>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    prefetch={false}
                    href="/sign-up"
                    className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                  >
                    <span>Signup</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden w-[93%]"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <Link
                        prefetch={false}
                        href={item.href}
                        className="text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200 flex justify-between items-center "
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        {item.icon}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="border-border space-y-3 border-t pt-6"
                  variants={mobileItemVariants}
                >
                  <Button>
                    <Label htmlFor="themeBtn">{icon}</Label>
                  </Button>
                  <ThemeToggleButton
                    variant="circle"
                    start="center"
                    className="hidden"
                  />
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        className="pt-1 flex justify-between items-center"
                      >
                        <div>
                          <div className="max-w-[250px] overflow-x-scroll">
                            <p className="text-2xl underline">
                              {session.user.name}
                            </p>
                            <p className="text-muted-foreground">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                        <Avatar className="w-14 h-14">
                          <AvatarImage
                            src={session.user.image}
                            alt={session.user.name}
                          />
                          <AvatarFallback className="text-2xl">
                            {session.user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>

                      <Button
                        onClick={() => authClient.signOut()}
                        type="button"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        prefetch={false}
                        href="/sign-in"
                        className="bg-primary block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        prefetch={false}
                        href="/sign-up"
                        className="bg-foreground text-primary block w-full rounded-lg py-3 text-center font-medium transition-all duration-200 dark:text-black"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
