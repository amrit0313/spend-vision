
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "switch" | "toggle" }) {
  const { theme, colorScheme, toggleTheme, toggleColorScheme } = useTheme();

  if (variant === "switch") {
    return (
      <div className="flex flex-col space-y-2">
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
        <div className="flex items-center space-x-2">
          <Switch 
            id="color-scheme" 
            checked={colorScheme === "black"} 
            onCheckedChange={toggleColorScheme}
          />
          <Label htmlFor="color-scheme" className="cursor-pointer text-sm">
            {colorScheme === "black" ? "Black" : "Blue"} Theme
          </Label>
        </div>
      </div>
    );
  }

  if (variant === "toggle") {
    return (
      <div className="flex flex-col space-y-2">
        <Toggle 
          aria-label="Toggle theme" 
          pressed={theme === "dark"} 
          onPressedChange={() => toggleTheme()}
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Toggle>
        <Toggle
          aria-label="Toggle color scheme"
          pressed={colorScheme === "black"}
          onPressedChange={() => toggleColorScheme()}
        >
          <Palette className="h-4 w-4" />
        </Toggle>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleColorScheme}
        aria-label="Toggle color scheme"
      >
        <Palette className="h-5 w-5" />
      </Button>
    </div>
  );
}
