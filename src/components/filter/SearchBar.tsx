import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative max-w-2xl mx-auto group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by building name, category, or date"
        className="w-full pl-14 pr-6 py-4 rounded-full bg-card border border-border shadow-soft text-base outline-none transition-all focus:shadow-lift focus:border-primary focus:ring-4 focus:ring-primary/20"
      />
    </div>
  );
}
