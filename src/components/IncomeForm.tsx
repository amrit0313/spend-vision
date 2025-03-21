
import { useState, useEffect } from "react";
import { createIncome, getIncomeCategories, createIncomeCategory } from "@/lib/api";
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

interface IncomeFormProps {
  onIncomeAdded: () => void;
}

export default function IncomeForm({ onIncomeAdded }: IncomeFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch income categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getIncomeCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch income categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const newCategory = await createIncomeCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setCategoryId(newCategory.id.toString());
      setNewCategoryName("");
      setIsAddingCategory(false);
      toast.success("Income category added successfully");
    } catch (error) {
      console.error("Failed to add income category:", error);
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
      await createIncome({
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
      
      toast.success("Income added successfully");
      onIncomeAdded();
    } catch (error) {
      console.error("Failed to add income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">Add Income (Optional)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount">Amount*</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="income-amount"
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
            <Label htmlFor="income-category">Category*</Label>
            <div className="flex space-x-2">
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Income Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="newIncomeCategory">Category Name</Label>
                      <Input
                        id="newIncomeCategory"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Salary, Freelance, Investments"
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
            <Label htmlFor="income-date">Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setDate(date || new Date())}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="income-description">Description</Label>
          <Textarea
            id="income-description"
            placeholder="Add details about this income"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Adding Income..." : "Add Income"}
        </Button>
      </form>
    </div>
  );
}
