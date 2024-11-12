'use client';

import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetRevenueQuery } from '@/queries/useOrder';
import { TrendingUp } from 'lucide-react';

// const chartData = [
//   { date: '2024-06-29', paidOrders: 103, totalOrders: 160 },
//   { date: '2024-06-30', paidOrders: 446, totalOrders: 400 },
// ];

const chartConfig1 = {
  paidOrders: {
    label: 'Tổng đơn đã thanh toán',
    color: 'hsl(var(--chart-1))',
  },
  totalOrders: {
    label: 'Tổng đơn',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const chartConfig2 = {
  views: {
    label: 'Doanh thu',
  },
  revenue: {
    label: 'revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function ChartOrder() {
  const { data, refetch } = useGetRevenueQuery();
  const chartData = useMemo(() => data?.payload.data ?? [], [data]);
  const [timeRange, setTimeRange] = React.useState('90d');
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ đường </CardTitle>
            <CardDescription>
              Số lượng đơn hàng trong 3 tháng gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig1}
              className='aspect-auto h-[250px] w-full'
            >
              <LineChart
                accessibilityLayer
                data={filteredData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey='totalOrders'
                  type='monotone'
                  stroke='var(--color-totalOrders)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='paidOrders'
                  type='monotone'
                  stroke='var(--color-paidOrders)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
            <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
              <CardTitle>Biểu đồ cột</CardTitle>
              <CardDescription>
                Doanh thu trong 3 tháng gần nhất
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='px-2 sm:p-6'>
            <ChartContainer
              config={chartConfig2}
              className='aspect-auto h-[250px] w-full'
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='w-[150px]'
                      nameKey='views'
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }}
                    />
                  }
                />
                <Bar dataKey={'revenue'} fill={`var(--color-revenue)`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
