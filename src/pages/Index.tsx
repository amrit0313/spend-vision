
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { WalletIcon, BarChartIcon, LineChartIcon, Lock } from "lucide-react";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 animate-fade-in">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WalletIcon className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-semibold">Expense Tracker</span>
          </div>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Track your expenses with ease
            </h1>
            <p className="text-lg text-muted-foreground">
              A simple and elegant way to monitor your spending habits, visualize patterns, and take control of your finances.
            </p>
            <div className="space-x-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass rounded-2xl border border-primary/10 p-8 shadow-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded-full bg-primary/20 animate-pulse"></div>
                  <div className="h-8 w-40 rounded-full bg-primary/30 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-24 w-full rounded-lg bg-primary/10 animate-pulse"></div>
                  <div className="h-24 w-full rounded-lg bg-primary/10 animate-pulse delay-150"></div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card p-8 rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Your financial data stays private with our secure authentication system.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
              <BarChartIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Insightful Bar Charts</h3>
            <p className="text-muted-foreground">
              Visualize your expenses and income side by side with interactive bar charts.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
              <LineChartIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trend Analysis</h3>
            <p className="text-muted-foreground">
              Track spending patterns over time with detailed line graphs for better financial planning.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <WalletIcon className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-muted-foreground">Expense Tracker</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
