"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { mainNavLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MainNav() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <div className="flex items-center lg:space-x-6 mx-4">
      <Button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu />
      </Button>
      <div
        className={cn(
          "absolute top-full left-0 w-full border bg-gray-100 dark:bg-gray-800",
          "lg:border-none lg:static lg:flex lg:space-x-6",
          menuOpen ? "block" : "hidden"
        )}
      >
        {mainNavLinks.map((link) => (
          <Link
            className={cn(
              "block py-2 px-4 text-sm transition-colors",
              pathName === link.url
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
            key={link.title}
            href={link.url}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
