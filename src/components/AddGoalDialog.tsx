import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Goal, GoalType, UserProfile } from '@/lib/types'
import { generateId } from '@/lib/calculations'

interface AddGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (goal: Goal) => void
  profile: UserProfile
}

export function AddGoalDialog({ open, onOpenChange, onAdd, profile }: AddGoalDialogProps) {
  const [goalType, setGoalType] = useState<'one-time' | 'recurring'>('one-time')
  const [loanType, setLoanType] = useState<'with-loan' | 'without-loan'>('without-loan')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [year, setYear] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [annualPayment, setAnnualPayment] = useState('')
  const [loanYears, setLoanYears] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [growthRate, setGrowthRate] = useState('')
  const [endYear, setEndYear] = useState('')

  const handleReset = () => {
    setGoalType('one-time')
    setLoanType('without-loan')
    setName('')
    setAmount('')
    setYear('')
    setDownPayment('')
    setAnnualPayment('')
    setLoanYears('')
    setInterestRate('')
    setGrowthRate('')
    setEndYear('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amountNum = parseFloat(amount)
    const yearNum = parseInt(year)

    if (!name || isNaN(amountNum) || isNaN(yearNum)) {
      return
    }

    let goal: Goal

    if (goalType === 'one-time') {
      if (loanType === 'with-loan') {
        const downNum = parseFloat(downPayment)
        const annualNum = parseFloat(annualPayment)
        const yearsNum = parseInt(loanYears)
        const interestNum = parseFloat(interestRate)

        if (isNaN(downNum) || isNaN(annualNum) || isNaN(yearsNum) || isNaN(interestNum)) {
          return
        }

        goal = {
          id: generateId(),
          name,
          type: 'loan',
          year: yearNum,
          amount: amountNum,
          loanDetails: {
            downPayment: downNum,
            annualPayment: annualNum,
            years: yearsNum,
            interestRate: interestNum,
          },
        }
      } else {
        goal = {
          id: generateId(),
          name,
          type: 'one-time',
          year: yearNum,
          amount: amountNum,
        }
      }
    } else {
      const growthNum = parseFloat(growthRate) || 0
      const endYearNum = endYear ? parseInt(endYear) : undefined

      goal = {
        id: generateId(),
        name,
        type: 'recurring',
        year: yearNum,
        amount: amountNum,
        recurringDetails: {
          growthRate: growthNum,
          endYear: endYearNum,
        },
      }
    }

    onAdd(goal)
    handleReset()
    onOpenChange(false)
  }

  const yearOptions: Array<{ year: number; age: number }> = []
  for (let i = 0; i <= profile.planningHorizonAge - profile.currentAge; i++) {
    const y = profile.startYear + i
    const age = profile.currentAge + i
    yearOptions.push({ year: y, age })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Financial Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Buy a house, New car, Childcare"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Goal Type</Label>
            <RadioGroup value={goalType} onValueChange={(v) => setGoalType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time" className="font-normal cursor-pointer">
                  One-time expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recurring" id="recurring" />
                <Label htmlFor="recurring" className="font-normal cursor-pointer">
                  Recurring annual expense
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({profile.currency})</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Start Year</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
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
                  <RadioGroupItem value="without-loan" id="without-loan" />
                  <Label htmlFor="without-loan" className="font-normal cursor-pointer">
                    Pay in full
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="with-loan" id="with-loan" />
                  <Label htmlFor="with-loan" className="font-normal cursor-pointer">
                    Finance with loan
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {goalType === 'one-time' && loanType === 'with-loan' && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Loan Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Down Payment</Label>
                  <Input
                    id="down-payment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="10000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual-payment">Annual Payment</Label>
                  <Input
                    id="annual-payment"
                    type="number"
                    value={annualPayment}
                    onChange={(e) => setAnnualPayment(e.target.value)}
                    placeholder="5000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-years">Loan Term (Years)</Label>
                  <Input
                    id="loan-years"
                    type="number"
                    value={loanYears}
                    onChange={(e) => setLoanYears(e.target.value)}
                    placeholder="10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="3.5"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {goalType === 'recurring' && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Recurring Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
                  <Input
                    id="growth-rate"
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    placeholder="3"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-year">End Year (Optional)</Label>
                  <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger id="end-year">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
