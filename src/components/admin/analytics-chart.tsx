'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartData {
  date: string;
  count: number;
}

interface BarChartData {
  fileName: string;
  count: number;
}

interface AnalyticsChartProps {
  data: LineChartData[] | BarChartData[];
  type: 'line' | 'bar';
  locale?: string;
}

export function AnalyticsChart({ data, type, locale = 'en' }: AnalyticsChartProps) {
  const isRTL = locale === 'ar';

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
        {isRTL ? 'لا توجد بيانات متاحة' : 'No data available'}
      </div>
    );
  }

  if (type === 'line') {
    const lineData = data as LineChartData[];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Bar chart for downloads
  const barData = data as BarChartData[];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#9ca3af" fontSize={12} />
        <YAxis
          dataKey="fileName"
          type="category"
          width={140}
          tickFormatter={(value) =>
            value
              .replace('.pdf', '')
              .replace('.docx', '')
              .replace(/-/g, ' ')
              .slice(0, 18)
          }
          stroke="#9ca3af"
          fontSize={11}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
