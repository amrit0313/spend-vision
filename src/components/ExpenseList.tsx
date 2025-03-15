
import { useState, useEffect } from "react";
import { getExpenses, deleteExpense, getCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface ExpenseWithCategory extends Omit<Expense, "categoryId"> {
  category: string;
}

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ExpenseList({ refreshTrigger }: { refreshTrigger: number }) {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [categories, setCategories] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories and convert to a map
        const categoriesData = await getCategories();
        const categoriesMap: { [key: number]: string } = {};
        categoriesData.forEach((cat: Category) => {
          categoriesMap[cat.id] = cat.name;
        });
        setCategories(categoriesMap);

        // Fetch expenses
        const expensesData = await getExpenses();
        
        // Map category names to expenses
        const expensesWithCategories = expensesData.map((expense: Expense) => ({
          id: expense.id,
          amount: expense.amount,
          description: expense.description,
          date: expense.date,
          category: categoriesMap[expense.categoryId] || "Unknown",
        }));
        
        // Sort by date (newest first)
        expensesWithCategories.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setExpenses(expensesWithCategories);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    }
    setExpenseToDelete(null);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>
          View and manage your recent expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-muted-foreground">Loading expenses...</div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No expenses found. Add your first expense using the form above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="animate-slide-up-fade">
                    <TableCell>
                      {format(parseISO(expense.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.description || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-expense">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog open={expenseToDelete === expense.id} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpenseToDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this expense. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
