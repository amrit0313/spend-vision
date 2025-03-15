
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseForm from "@/components/ExpenseForm";
import IncomeForm from "@/components/IncomeForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import { LogOut, Menu, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="text-left">
                    <SheetTitle>Expense Tracker</SheetTitle>
                    <SheetDescription>
                      Welcome back, {user?.username}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-8 space-y-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          className="w-full justify-start" 
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Transaction
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <Tabs defaultValue="expense" className="w-full">
                          <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="expense">Expense</TabsTrigger>
                            <TabsTrigger value="income">Income</TabsTrigger>
                          </TabsList>
                          <TabsContent value="expense">
                            <ExpenseForm onExpenseAdded={handleDataChange} />
                          </TabsContent>
                          <TabsContent value="income">
                            <IncomeForm onIncomeAdded={handleDataChange} />
                          </TabsContent>
                        </Tabs>
                      </SheetContent>
                    </Sheet>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-muted-foreground" 
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl font-bold tracking-tight">Expense Tracker</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <Tabs defaultValue="expense" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expense">
                      <ExpenseForm onExpenseAdded={handleDataChange} />
                    </TabsContent>
                    <TabsContent value="income">
                      <IncomeForm onIncomeAdded={handleDataChange} />
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            )}
            
            {!isMobile && (
              <Button variant="outline" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <ExpenseChart />
          <ExpenseList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}
