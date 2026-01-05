import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Pencil, Trash, Check, X } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/calculations'

interface EditableItemCardProps {
  name: string
  amount: number
  growthRate?: number
  risk?: number
  currency: string
  onEdit: (updates: { name: string; amount: number; growthRate?: number; risk?: number; endYear?: number }) => void
  onDelete: () => void
  monthlyPayment?: number
  onEditMonthlyPayment?: (payment: number) => void
  endYear?: number
  profileAge?: number
  profileHorizonAge?: number
  profileStartYear?: number
}

export function EditableItemCard({
  name,
  amount,
  growthRate,
  risk,
  currency,
  onEdit,
  onDelete,
  monthlyPayment,
  onEditMonthlyPayment,
  endYear,
  profileAge,
  profileHorizonAge,
  profileStartYear,
}: EditableItemCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editAmount, setEditAmount] = useState(amount.toString())
  const [editGrowthRate, setEditGrowthRate] = useState(growthRate?.toString() || '0')
  const [editRisk, setEditRisk] = useState(risk?.toString() || '0')
  const [editMonthlyPayment, setEditMonthlyPayment] = useState(monthlyPayment?.toString() || '0')
  const [editEndYear, setEditEndYear] = useState(endYear?.toString() || '')

  const handleSave = () => {
    const amountNum = parseFloat(editAmount)
    const growthNum = parseFloat(editGrowthRate)
    const riskNum = parseFloat(editRisk)
    const monthlyNum = parseFloat(editMonthlyPayment)
    const endYearNum = editEndYear ? parseFloat(editEndYear) : undefined

    if (editName && !isNaN(amountNum)) {
      onEdit({
        name: editName,
        amount: amountNum,
        growthRate: growthRate !== undefined ? growthNum : undefined,
        risk: risk !== undefined ? riskNum : undefined,
        endYear: endYearNum,
      })
      if (monthlyPayment !== undefined && onEditMonthlyPayment && !isNaN(monthlyNum)) {
        onEditMonthlyPayment(monthlyNum)
      }
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditName(name)
    setEditAmount(amount.toString())
    setEditGrowthRate(growthRate?.toString() || '0')
    setEditRisk(risk?.toString() || '0')
    setEditMonthlyPayment(monthlyPayment?.toString() || '0')
    setEditEndYear(endYear?.toString() || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="p-4 space-y-4 border-accent">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Item name"
          />
        </div>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        {growthRate !== undefined && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Growth Rate</Label>
                <span className="text-sm font-semibold tabular-nums">{editGrowthRate}%</span>
              </div>
              <Slider
                value={[parseFloat(editGrowthRate)]}
                onValueChange={([val]) => setEditGrowthRate(val.toString())}
                min={-20}
                max={30}
                step={0.5}
                className="w-full"
              />
            </div>

            {risk !== undefined && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Risk / Volatility</Label>
                  <span className="text-sm font-semibold tabular-nums">{(parseFloat(editRisk) * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[parseFloat(editRisk)]}
                  onValueChange={([val]) => setEditRisk(val.toString())}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {parseFloat(editRisk) === 0 ? 'No risk: growth is constant' : 
                   `Growth varies from ${(parseFloat(editGrowthRate) - (parseFloat(editGrowthRate) * parseFloat(editRisk))).toFixed(1)}% to ${(parseFloat(editGrowthRate) + (2 * parseFloat(editGrowthRate) * parseFloat(editRisk))).toFixed(1)}% annually`}
                </p>
              </div>
            )}
          </>
        )}

        {monthlyPayment !== undefined && onEditMonthlyPayment && (
          <div className="space-y-2">
            <Label>Monthly Payment</Label>
            <Input
              type="number"
              value={editMonthlyPayment}
              onChange={(e) => setEditMonthlyPayment(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        {profileAge !== undefined && profileHorizonAge !== undefined && profileStartYear !== undefined && (
          <div className="space-y-2">
            <Label>End Year (Optional)</Label>
            <Input
              type="number"
              value={editEndYear}
              onChange={(e) => setEditEndYear(e.target.value)}
              placeholder={`Leave empty for full horizon (age ${profileHorizonAge})`}
              min={profileStartYear}
            />
            {editEndYear && !isNaN(parseFloat(editEndYear)) && (
              <p className="text-xs text-accent font-medium">
                Income ends at age {profileAge + (parseFloat(editEndYear) - profileStartYear)} (Year {parseFloat(editEndYear)})
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Last year this income will be received (e.g., retirement)
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            <Check className="mr-2" size={16} />
            Save
          </Button>
          <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
            <X className="mr-2" size={16} />
            Cancel
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-base truncate">{name}</h4>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">
            {formatCurrency(amount, currency)}
          </p>
          {growthRate !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {growthRate >= 0 ? '+' : ''}
              {growthRate}% annual growth
              {risk !== undefined && risk > 0 && (
                <span className="ml-1">• {(risk * 100).toFixed(0)}% risk</span>
              )}
            </p>
          )}
          {monthlyPayment !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(monthlyPayment, currency)}/month
            </p>
          )}
          {endYear !== undefined && endYear > 0 && profileAge !== undefined && profileStartYear !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              Ends in {endYear} (age {profileAge + (endYear - profileStartYear)})
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
