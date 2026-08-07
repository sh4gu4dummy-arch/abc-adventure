import {
  Cat,
  Crown,
  Fish,
  Heart,
  Moon,
  Rocket,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { AvatarId } from "@/lib/profiles";
import { cn } from "@/lib/utils";

const MAP: Record<AvatarId, LucideIcon> = {
  star: Star,
  heart: Heart,
  rocket: Rocket,
  cat: Cat,
  fish: Fish,
  sun: Sun,
  moon: Moon,
  crown: Crown,
};

export function AvatarIcon({
  id,
  className,
}: {
  id: AvatarId;
  className?: string;
}) {
  const Icon = MAP[id] ?? Star;
  return <Icon className={cn("size-6", className)} aria-hidden />;
}

export function PlayerAvatar({
  avatar,
  color,
  name,
  size = "md",
}: {
  avatar: AvatarId;
  color: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "size-10 text-base",
    md: "size-14 text-lg",
    lg: "size-20 text-2xl",
  };
  const iconSizes = {
    sm: "size-5",
    md: "size-7",
    lg: "size-10",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-4 border-white text-white shadow-[var(--shadow-card)]",
        sizes[size],
      )}
      style={{ background: color }}
      aria-hidden
      title={name}
    >
      <AvatarIcon id={avatar} className={iconSizes[size]} />
    </div>
  );
}
