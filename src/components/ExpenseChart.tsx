
import { useState, useEffect } from "react";
import { getIncomeExpensesSummary } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExpenseSummary {
  date: string;
  total_income: number;
  total_expenses: number;
}

export default function ExpenseChart() {
  const [data, setData] = useState<ExpenseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get data for the last 6 months
        const endDate = format(new Date(), "yyyy-MM-dd");
        const startDate = format(subMonths(new Date(), 5), "yyyy-MM-dd");
        const summaryData = await getIncomeExpensesSummary(startDate, endDate);
        
        // Format dates to be more readable
        const formattedData = summaryData.map(item => ({
          ...item,
          date: format(new Date(item.date + "-01"), "MMM yyyy")
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch summary data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate placeholder data if no data exists
  useEffect(() => {
    if (!isLoading && data.length === 0) {
      const placeholderData: ExpenseSummary[] = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 6; i++) {
        const date = subMonths(currentDate, i);
        placeholderData.unshift({
          date: format(date, "MMM yyyy"),
          total_income: 0,
          total_expenses: 0
        });
      }
      
      setData(placeholderData);
    }
  }, [isLoading, data]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Expenses & Income Overview</CardTitle>
        <CardDescription>
          Visualize your spending and income patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <Tabs defaultValue="bar" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-2">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar" className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: isMobile ? 0 : 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    tickMargin={10}
                  />
                  <YAxis 
                    fontSize={12} 
                    tickFormatter={formatCurrency}
                    width={isMobile ? 60 : 80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Income" 
                    dataKey="total_income" 
                    fill="#81C784" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Bar 
                    name="Expenses" 
                    dataKey="total_expenses" 
                    fill="#E57373" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="line" className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: isMobile ? 0 : 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    tickMargin={10}
                  />
                  <YAxis 
                    fontSize={12} 
                    tickFormatter={formatCurrency}
                    width={isMobile ? 60 : 80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend />
                  <Line 
                    name="Income" 
                    type="monotone" 
                    dataKey="total_income" 
                    stroke="#81C784" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                  <Line 
                    name="Expenses" 
                    type="monotone" 
                    dataKey="total_expenses" 
                    stroke="#E57373" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
