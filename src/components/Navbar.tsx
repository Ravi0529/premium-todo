"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { LogOut, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group select-none">
            <img
              src="/window.svg"
              alt="TodoMaster Logo"
              className="h-8 w-8 transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-extrabold text-black tracking-tight transition-colors group-hover:text-primary">
              TodoMaster
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 border-2 border-muted-foreground/20 hover:border-primary/60 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/subscribe" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Subscribe</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="default"
                  asChild
                  size="lg"
                  className="px-5 font-semibold"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="px-5 font-semibold"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
