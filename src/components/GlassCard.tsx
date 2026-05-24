import { ReactNode } from "react";

type Props = {
  children: ReactNode;

  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-[32px]
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}