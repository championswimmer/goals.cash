import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PencilSimple, Trash, Check, X } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/calculations'
import type { Goal, UserProfile } from '@/lib/types'

interface EditableGoalCardProps {
  goal: Goal
  profile: UserProfile
  onEdit: (updates: Partial<Goal>) => void
  onDelete: () => void
}

export function EditableGoalCard({ goal, profile, onEdit, onDelete }: EditableGoalCardProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(goal.name)
  const [amount, setAmount] = useState(goal.amount.toString())
  const [year, setYear] = useState(goal.year.toString())
  const [goalType, setGoalType] = useState<'one-time' | 'recurring'>(
    goal.type === 'recurring' ? 'recurring' : 'one-time'
  )
  const [loanType, setLoanType] = useState<'with-loan' | 'without-loan'>(
    goal.type === 'loan' ? 'with-loan' : 'without-loan'
  )
  const [downPayment, setDownPayment] = useState(goal.loanDetails?.downPayment?.toString() || '')
  const [annualPayment, setAnnualPayment] = useState(goal.loanDetails?.annualPayment?.toString() || '')
  const [loanYears, setLoanYears] = useState(goal.loanDetails?.years?.toString() || '')
  const [interestRate, setInterestRate] = useState(goal.loanDetails?.interestRate?.toString() || '')
  const [growthRate, setGrowthRate] = useState(goal.recurringDetails?.growthRate?.toString() || '0')
  const [endYear, setEndYear] = useState(goal.recurringDetails?.endYear?.toString() || '')

  const handleSave = () => {
    const amountNum = parseFloat(amount)
    const yearNum = parseInt(year)

    if (!name || isNaN(amountNum) || isNaN(yearNum)) {
      return
    }

    let updates: Partial<Goal> = {
      name,
      amount: amountNum,
      year: yearNum,
    }

    if (goalType === 'one-time') {
      if (loanType === 'with-loan') {
        const downNum = parseFloat(downPayment)
        const annualNum = parseFloat(annualPayment)
        const yearsNum = parseInt(loanYears)
        const interestNum = parseFloat(interestRate)

        if (isNaN(downNum) || isNaN(annualNum) || isNaN(yearsNum) || isNaN(interestNum)) {
          return
        }

        updates.type = 'loan'
        updates.loanDetails = {
          downPayment: downNum,
          annualPayment: annualNum,
          years: yearsNum,
          interestRate: interestNum,
        }
        updates.recurringDetails = undefined
      } else {
        updates.type = 'one-time'
        updates.loanDetails = undefined
        updates.recurringDetails = undefined
      }
    } else {
      const growthNum = parseFloat(growthRate) || 0
      const endYearNum = endYear ? parseInt(endYear) : undefined

      updates.type = 'recurring'
      updates.recurringDetails = {
        growthRate: growthNum,
        endYear: endYearNum,
      }
      updates.loanDetails = undefined
    }

    onEdit(updates)
    setEditing(false)
  }

  const handleCancel = () => {
    setName(goal.name)
    setAmount(goal.amount.toString())
    setYear(goal.year.toString())
    setGoalType(goal.type === 'recurring' ? 'recurring' : 'one-time')
    setLoanType(goal.type === 'loan' ? 'with-loan' : 'without-loan')
    setDownPayment(goal.loanDetails?.downPayment?.toString() || '')
    setAnnualPayment(goal.loanDetails?.annualPayment?.toString() || '')
    setLoanYears(goal.loanDetails?.years?.toString() || '')
    setInterestRate(goal.loanDetails?.interestRate?.toString() || '')
    setGrowthRate(goal.recurringDetails?.growthRate?.toString() || '0')
    setEndYear(goal.recurringDetails?.endYear?.toString() || '')
    setEditing(false)
  }

  const yearOptions: Array<{ year: number; age: number }> = []
  for (let i = 0; i <= profile.planningHorizonAge - profile.currentAge; i++) {
    const y = profile.startYear + i
    const age = profile.currentAge + i
    yearOptions.push({ year: y, age })
  }

  const age = profile.currentAge + (goal.year - profile.startYear)

  if (!editing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-base mb-1">{goal.name}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {formatCurrency(goal.amount, profile.currency)} in {goal.year} (Age {age})
                </p>
                {goal.type === 'one-time' && <p className="text-xs">One-time expense</p>}
                {goal.type === 'loan' && (
                  <div className="text-xs space-y-0.5">
                    <p>Financed with loan</p>
                    <p>
                      Down: {formatCurrency(goal.loanDetails!.downPayment, profile.currency)} • Annual
                      payment: {formatCurrency(goal.loanDetails!.annualPayment, profile.currency)}
                    </p>
                    <p>
                      {goal.loanDetails!.years} years @ {goal.loanDetails!.interestRate}%
                    </p>
                  </div>
                )}
                {goal.type === 'recurring' && (
                  <div className="text-xs space-y-0.5">
                    <p>Annual recurring expense</p>
                    <p>Growth rate: {goal.recurringDetails!.growthRate}%</p>
                    {goal.recurringDetails!.endYear && <p>Until {goal.recurringDetails!.endYear}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <PencilSimple size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-accent">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`goal-name-${goal.id}`}>Goal Name</Label>
            <Input
              id={`goal-name-${goal.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Buy a house"
            />
          </div>

          <div className="space-y-3">
            <Label>Goal Type</Label>
            <RadioGroup value={goalType} onValueChange={(v) => setGoalType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id={`one-time-${goal.id}`} />
                <Label htmlFor={`one-time-${goal.id}`} className="font-normal cursor-pointer">
                  One-time expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recurring" id={`recurring-${goal.id}`} />
                <Label htmlFor={`recurring-${goal.id}`} className="font-normal cursor-pointer">
                  Recurring annual expense
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`amount-${goal.id}`}>Amount</Label>
              <Input
                id={`amount-${goal.id}`}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`year-${goal.id}`}>Start Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id={`year-${goal.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((opt) => (
                    <SelectItem key={opt.year} value={opt.year.toString()}>
                      {opt.year} (Age {opt.age})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {goalType === 'one-time' && (
            <div className="space-y-3">
              <Label>Financing</Label>
              <RadioGroup value={loanType} onValueChange={(v) => setLoanType(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="without-loan" id={`without-loan-${goal.id}`} />
                  <Label htmlFor={`without-loan-${goal.id}`} className="font-normal cursor-pointer">
                    Pay in full
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="with-loan" id={`with-loan-${goal.id}`} />
                  <Label htmlFor={`with-loan-${goal.id}`} className="font-normal cursor-pointer">
                    Finance with loan
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {goalType === 'one-time' && loanType === 'with-loan' && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">Loan Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`down-${goal.id}`}>Down Payment</Label>
                  <Input
                    id={`down-${goal.id}`}
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`annual-${goal.id}`}>Annual Payment</Label>
                  <Input
                    id={`annual-${goal.id}`}
                    type="number"
                    value={annualPayment}
                    onChange={(e) => setAnnualPayment(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`years-${goal.id}`}>Loan Years</Label>
                  <Input
                    id={`years-${goal.id}`}
                    type="number"
                    value={loanYears}
                    onChange={(e) => setLoanYears(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`interest-${goal.id}`}>Interest Rate (%)</Label>
                  <Input
                    id={`interest-${goal.id}`}
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {goalType === 'recurring' && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">Recurring Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`growth-${goal.id}`}>Growth Rate (%)</Label>
                  <Input
                    id={`growth-${goal.id}`}
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`end-${goal.id}`}>End Year</Label>
                  <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger id={`end-${goal.id}`}>
                      <SelectValue placeholder="Never ends" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Never ends</SelectItem>
                      {yearOptions
                        .filter((opt) => opt.year > parseInt(year || '0'))
                        .map((opt) => (
                          <SelectItem key={opt.year} value={opt.year.toString()}>
                            {opt.year} (Age {opt.age})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Check className="mr-2" size={16} />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
              <X className="mr-2" size={16} />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
