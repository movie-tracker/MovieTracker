import { MoreHorizontal, Star, Eye, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { WatchListStatus } from "@/types/movie";

interface WatchlistDropdownProps {
  onStatusChange: (status: WatchListStatus | null) => void;
  currentStatus?: WatchListStatus | null;
}

const WatchlistDropdown = ({ onStatusChange, currentStatus }: WatchlistDropdownProps) => {
  const statusOptions = [
    { value: "Quero assistir" as WatchListStatus, label: "Quero assistir", icon: Clock, color: "text-blue-400" },
    { value: "Assistindo" as WatchListStatus, label: "Assistindo", icon: Eye, color: "text-yellow-400" },
    { value: "Assistido" as WatchListStatus, label: "Assistido", icon: Star, color: "text-green-400" },
    { value: "Abandonado" as WatchListStatus, label: "Abandonado", icon: X, color: "text-red-400" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`hover:bg-slate-700 cursor-pointer ${
                currentStatus === option.value ? 'bg-slate-700' : ''
              }`}
            >
              <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
        {currentStatus && (
          <>
            <DropdownMenuSeparator className="bg-slate-600" />
            <DropdownMenuItem
              onClick={() => onStatusChange(null)}
              className="hover:bg-slate-700 cursor-pointer text-gray-400"
            >
              <X className="h-4 w-4 mr-2" />
              Remover da lista
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WatchlistDropdown; 