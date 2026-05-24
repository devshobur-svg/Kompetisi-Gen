import { Bell } from "lucide-react";

type Props = {
  title: string;

  subtitle?: string;
};

export default function AppHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-white/50">
          {subtitle}
        </div>

        <h1 className="text-3xl font-bold mt-1">
          {title}
        </h1>
      </div>

      <button
        className="
          w-12
          h-12
          rounded-2xl
          bg-white/5
          border
          border-white/10
          flex
          items-center
          justify-center
        "
      >
        <Bell size={20} />
      </button>
    </div>
  );
}