import { useMemo, useState } from 'react'
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import type { YearlyProjection, Goal } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FinancialChartProps {
  projections: YearlyProjection[]
  currency: string
  goals: Goal[]
}

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        textAnchor="end"
        fill="currentColor"
        transform="rotate(-45)"
        fontSize={12}
      >
        {payload.value}
      </text>
    </g>
  )
}

export function FinancialChart({ projections, currency, goals }: FinancialChartProps) {
  const [showExpensesNegative, setShowExpensesNegative] = useState(true)

  const chartData = useMemo(() => {
    return projections.map((p) => ({
      year: p.year,
      age: p.age,
      income: p.totalIncome,
      expenses: showExpensesNegative ? -p.totalExpenses : p.totalExpenses,
      netWorth: p.netWorth,
      assets: p.totalAssets,
      liabilities: p.totalLiabilities,
    }))
  }, [projections, showExpensesNegative])

  const goalMarkers = useMemo(() => {
    return goals.map((goal) => {
      const projection = projections.find((p) => p.year === goal.year)
      return {
        year: goal.year,
        netWorth: projection?.netWorth || 0,
        name: goal.name,
        type: goal.type,
      }
    })
  }, [goals, projections])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Financial Projections</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExpensesNegative(!showExpensesNegative)}
        >
          {showExpensesNegative ? (
            <>
              <Eye className="mr-2" size={16} />
              Show Same Side
            </>
          ) : (
            <>
              <EyeSlash className="mr-2" size={16} />
              Show Negative
            </>
          )}
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Income & Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 250)" />
              <XAxis
                dataKey="year"
                tick={<CustomXAxisTick />}
                tickFormatter={(value) => {
                  const item = chartData.find((d) => d.year === value)
                  return `${value} (${item?.age})`
                }}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const abs = Math.abs(value)
                  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (abs >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.88 0.01 250)',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(Math.abs(value), currency),
                  name === 'income' ? 'Income' : 'Expenses',
                ]}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.year === label)
                  return `Year ${label} (Age ${item?.age})`
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (value === 'income' ? 'Income' : 'Expenses')}
              />
              <Bar dataKey="income" fill="oklch(0.55 0.15 150)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="oklch(0.55 0.18 20)" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Net Worth</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 60, bottom: 60 }}>
              <defs>
                <linearGradient id="netWorthGradientPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 150)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 150)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="netWorthGradientNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.18 20)" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="oklch(0.55 0.18 20)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 250)" />
              <XAxis
                dataKey="year"
                tick={<CustomXAxisTick />}
                tickFormatter={(value) => {
                  const item = chartData.find((d) => d.year === value)
                  return `${value} (${item?.age})`
                }}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const abs = Math.abs(value)
                  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (abs >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.88 0.01 250)',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  let label = name
                  if (name === 'netWorth') label = 'Net Worth'
                  else if (name === 'assets') label = 'Total Assets'
                  else if (name === 'liabilities') label = 'Total Liabilities'
                  return [formatCurrency(value, currency), label]
                }}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.year === label)
                  return `Year ${label} (Age ${item?.age})`
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  if (value === 'netWorth') return 'Net Worth'
                  if (value === 'assets') return 'Total Assets'
                  if (value === 'liabilities') return 'Total Liabilities'
                  return value
                }}
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="oklch(0.45 0.15 250)"
                strokeWidth={3}
                fill="url(#netWorthGradientPositive)"
              />
              <Line
                type="monotone"
                dataKey="assets"
                stroke="oklch(0.55 0.15 150)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="liabilities"
                stroke="oklch(0.55 0.18 20)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              {goalMarkers.map((marker, index) => (
                <ReferenceDot
                  key={index}
                  x={marker.year}
                  y={marker.netWorth}
                  r={8}
                  fill="oklch(0.60 0.14 200)"
                  stroke="oklch(1 0 0)"
                  strokeWidth={2}
                  label={{
                    value: marker.name,
                    position: 'top',
                    fontSize: 11,
                    fill: 'oklch(0.20 0.01 250)',
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
