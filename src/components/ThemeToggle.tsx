
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "switch" | "toggle" }) {
  const { theme, toggleTheme } = useTheme();

  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-2">
        <Switch 
          id="theme-mode" 
          checked={theme === "dark"} 
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="theme-mode" className="cursor-pointer">
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Label>
      </div>
    );
  }

  if (variant === "toggle") {
    return (
      <Toggle 
        aria-label="Toggle theme" 
        pressed={theme === "dark"} 
        onPressedChange={() => toggleTheme()}
      >
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Toggle>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
