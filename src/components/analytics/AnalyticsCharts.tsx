"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AnalyticsChartsProps {
  trend: { date: string; percentage: number; total: number }[];
  subjectBar: {
    name: string;
    fullName: string;
    percentage: number;
    present: number;
    absent: number;
    od: number;
  }[];
  distribution: { name: string; value: number; color: string }[];
  monthlyPie: { name: string; value: number; percentage: number }[];
}

const PIE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function AnalyticsCharts({
  trend,
  subjectBar,
  distribution,
  monthlyPie,
}: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall Attendance Trend</CardTitle>
        </CardHeader>
        <div className="h-72">
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, #fff)",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Add attendance records to see trends" />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Wise Attendance</CardTitle>
        </CardHeader>
        <div className="h-72">
          {subjectBar.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Attendance"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName || ""
                  }
                />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No subject data available" />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
        </CardHeader>
        <div className="h-72">
          {monthlyPie.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={false}
                >
                  {monthlyPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No monthly data available" />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Distribution</CardTitle>
        </CardHeader>
        <div className="h-72">
          {distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No attendance records yet" />
          )}
        </div>
      </Card>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
      {message}
    </div>
  );
}
