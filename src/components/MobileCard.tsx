import { ReactNode } from "react";

type Props = {
  children: ReactNode;

  className?: string;
};

export default function MobileCard({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
        shadow-black/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}