'use client';

import React, { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
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

// const chartData = [
//   { date: '2024-06-29', paidOrders: 103, totalOrders: 160 },
//   { date: '2024-06-30', paidOrders: 446, totalOrders: 400 },
// ];

const chartConfig1 = {
  visitors: {
    label: 'Visitors',
  },
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
          <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
            <div className='grid flex-1 gap-1 text-center sm:text-left'>
              <CardTitle>Biểu đồ doanh thu 3 tháng</CardTitle>
              <CardDescription>
                Tổng doanh thu các đơn hàng đã thanh toán trong 3 tháng gần nhất
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className='w-[160px] rounded-lg sm:ml-auto'
                aria-label='Select a value'
              >
                <SelectValue placeholder='Last 3 months' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='90d' className='rounded-lg'>
                  3 tháng gần nhất
                </SelectItem>
                <SelectItem value='30d' className='rounded-lg'>
                  30 ngày gần nhất
                </SelectItem>
                <SelectItem value='7d' className='rounded-lg'>
                  7 ngày gần nhất
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
            <ChartContainer
              config={chartConfig1}
              className='aspect-auto h-[250px] w-full'
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient
                    id='fillPaidOrders'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor='var(--color-paidOrders)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-paidOrders)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id='fillTotalOrders'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor='var(--color-totalOrders)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-totalOrders)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                      indicator='dot'
                    />
                  }
                />
                <Area
                  dataKey='totalOrders'
                  type='natural'
                  fill='url(#fillTotalOrders)'
                  stroke='var(--color-totalOrders)'
                  stackId='a'
                />
                <Area
                  dataKey='paidOrders'
                  type='natural'
                  fill='url(#fillPaidOrders)'
                  stroke='var(--color-paidOrders)'
                  stackId='a'
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
            <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
              <CardTitle>Bar Chart - Interactive</CardTitle>
              <CardDescription>
                Showing total visitors for the last 3 months
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
