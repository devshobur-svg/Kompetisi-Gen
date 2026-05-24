type Props = {
  children: React.ReactNode;

  onClick?: () => void;

  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6
        py-4
        rounded-2xl
        font-semibold
        bg-gradient-to-r
        from-blue-600
        to-purple-600
        hover:scale-[1.02]
        active:scale-[0.98]
        transition-all
        duration-200
        shadow-lg
        shadow-purple-500/20
        ${className}
      `}
    >
      {children}
    </button>
  );
}