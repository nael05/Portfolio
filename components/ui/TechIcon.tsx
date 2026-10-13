import Image from "next/image";

const iconMap: Record<string, string> = {
  python: "python/python-original.svg",
  javascript: "javascript/javascript-original.svg",
  typescript: "typescript/typescript-original.svg",
  html: "html5/html5-original.svg",
  css: "css3/css3-original.svg",
  go: "go/go-original.svg",
  java: "java/java-original.svg",
  c: "c/c-original.svg",
  "c++": "cplusplus/cplusplus-original.svg",
  "c#": "csharp/csharp-original.svg",
  react: "react/react-original.svg",
  "next.js": "nextjs/nextjs-original.svg",
  nextjs: "nextjs/nextjs-original.svg",
  sql: "mysql/mysql-original.svg",
  mysql: "mysql/mysql-original.svg",
  php: "php/php-original.svg",
  vue: "vuejs/vuejs-original.svg",
  docker: "docker/docker-original.svg",
  git: "git/git-original.svg",
  node: "nodejs/nodejs-original.svg",
  nodejs: "nodejs/nodejs-original.svg",
  tailwind: "tailwindcss/tailwindcss-original.svg",
  tailwindcss: "tailwindcss/tailwindcss-original.svg",
};

export function getTechIconUrl(name: string): string | null {
  const normalized = name.toLowerCase();
  const iconPath = iconMap[normalized];
  if (!iconPath) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`;
}

export function TechIcon({ name }: { name: string }) {
  const url = getTechIconUrl(name);

  if (!url) {
    return (
      <span className="pill text-[10px] sm:text-xs !py-1 !px-2.5 whitespace-nowrap bg-surface-elevated/50 hover:bg-surface-elevated transition-colors border-border/50">
        {name}
      </span>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-md"
      title={name}
    >
      <Image 
        src={url} 
        alt={name} 
        width={16} 
        height={16} 
        className="w-4 h-4 object-contain drop-shadow-md" 
        unoptimized 
      />
      <span className="text-xs font-medium text-foreground/90 tracking-wide">{name}</span>
    </div>
  );
}
