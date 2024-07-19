"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-120%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Job based interview</HoveredLink>
            <HoveredLink href="/interface-design">
              Resume based interview
            </HoveredLink>
            <HoveredLink href="/seo">Personalized Interview</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="text-sm flex flex-col gap-2">
            <HoveredLink href="/web-dev">Github</HoveredLink>
            <HoveredLink href="/interface-design">LinkedIn</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </motion.div>
  );
}

export default Navbar;
