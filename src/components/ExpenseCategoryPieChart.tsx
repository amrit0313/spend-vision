
import { useState, useEffect } from "react";
import { getExpensesByCategory } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format, subMonths } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseByCategory {
  category_name: string;
  total_amount: number;
}

// Colorful but accessible color palette for the pie chart
const COLORS = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#22C55E", // Green
  "#0EA5E9", // Blue
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#EF4444", // Red
  "#06B6D4", // Cyan
];

export default function ExpenseCategoryPieChart() {
  const [data, setData] = useState<ExpenseByCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get data for the last 6 months
        const endDate = format(new Date(), "yyyy-MM-dd");
        const startDate = format(subMonths(new Date(), 5), "yyyy-MM-dd");
        const categoryData = await getExpensesByCategory(startDate, endDate);
        
        setData(categoryData);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate placeholder data if no data exists
  useEffect(() => {
    if (!isLoading && data.length === 0) {
      const placeholderData: ExpenseByCategory[] = [
        { category_name: "No expenses", total_amount: 1 }
      ];
      setData(placeholderData);
    }
  }, [isLoading, data]);

  // Format data for the pie chart with custom name field for the Legend
  const formattedData = data.map((item, index) => ({
    name: item.category_name,
    value: item.total_amount,
    color: COLORS[index % COLORS.length]
  }));

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for small slices

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>
          See how your spending is distributed across different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={isMobile ? 80 : 110}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"} 
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  align={isMobile ? "center" : "right"}
                  wrapperStyle={isMobile ? {} : { right: 0 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
