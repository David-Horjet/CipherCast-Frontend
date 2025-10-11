import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-smooth" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <span className="font-mono text-xl font-bold text-white">C</span>
        </div>
      </div>
      <span className="font-sans hidden md:block text-xl font-bold tracking-tight text-foreground">
        Cypher<span className="text-primary">Cast</span>
      </span>
    </Link>
  );
};

export default Logo;
