
import { useState, useEffect } from "react";
import { createExpense, getCategories, createCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

// Default categories to be created for new users
const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Entertainment"
];

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [initializingDefaultCategories, setInitializingDefaultCategories] = useState(false);

  // Fetch expense categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      
      // If no categories exist, create default ones
      if (data.length === 0 && !initializingDefaultCategories) {
        setInitializingDefaultCategories(true);
        await createDefaultCategories();
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const createDefaultCategories = async () => {
    try {
      const createdCategories = [];
      for (const categoryName of DEFAULT_CATEGORIES) {
        const newCategory = await createCategory(categoryName);
        createdCategories.push(newCategory);
      }
      
      setCategories(createdCategories);
      if (createdCategories.length > 0) {
        setCategoryId(createdCategories[0].id.toString());
      }
      
      toast.success("Default expense categories have been created");
      setInitializingDefaultCategories(false);
    } catch (error) {
      console.error("Failed to create default categories:", error);
      setInitializingDefaultCategories(false);
    }
  };

  const handleAddCategory = async (e: React.MouseEvent) => {
    // Prevent event bubbling to parent sheets/modals
    e.preventDefault();
    e.stopPropagation();
    
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const newCategory = await createCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setCategoryId(newCategory.id.toString());
      setNewCategoryName("");
      setIsAddingCategory(false);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      await createExpense({
        amount: parseFloat(amount),
        description,
        categoryId: parseInt(categoryId),
        date: format(date, "yyyy-MM-dd"),
      });
      
      // Reset form
      setAmount("");
      setDescription("");
      setCategoryId("");
      setDate(new Date());
      
      toast.success("Expense added successfully");
      onExpenseAdded();
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle calendar click and prevent it from closing parent sheets
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="bg-card rounded-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount*</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category*</Label>
            <div className="flex space-x-2">
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingCategory(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="sm:max-w-[425px]"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                  onEscapeKeyDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="newCategory">Category Name</Label>
                      <Input
                        id="newCategory"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Groceries, Utilities, Entertainment"
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleAddCategory}
                      disabled={isLoading}
                    >
                      Add Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Date*</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCalendarOpen(true);
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                  e.preventDefault();
                }}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleCalendarSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Adding Expense..." : "Add Expense"}
        </Button>
      </form>
    </div>
  );
}
