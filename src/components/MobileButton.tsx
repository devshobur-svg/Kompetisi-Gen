type Props = {
  children: React.ReactNode;

  onClick?: () => void;

  className?: string;
};

export default function MobileButton({
  children,
  onClick,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        h-14
        px-5
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        to-purple-600
        text-white
        font-semibold
        shadow-lg
        shadow-purple-500/20
        active:scale-95
        transition-all
        ${className}
      `}
    >
      {children}
    </button>
  );
}