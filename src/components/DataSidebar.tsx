import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus } from '@phosphor-icons/react'
import { EditableItemCard } from './EditableItemCard'
import { EditableGoalCard } from './EditableGoalCard'
import type { Asset, Liability, Income, Expense, Goal, UserProfile } from '@/lib/types'
import { generateId } from '@/lib/calculations'

interface DataSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  assets: Asset[]
  liabilities: Liability[]
  incomes: Income[]
  expenses: Expense[]
  goals: Goal[]
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void
  onDeleteAsset: (id: string) => void
  onAddAsset: (asset: Asset) => void
  onUpdateLiability: (id: string, updates: Partial<Liability>) => void
  onDeleteLiability: (id: string) => void
  onAddLiability: (liability: Liability) => void
  onUpdateIncome: (id: string, updates: Partial<Income>) => void
  onDeleteIncome: (id: string) => void
  onAddIncome: (income: Income) => void
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void
  onDeleteExpense: (id: string) => void
  onAddExpense: (expense: Expense) => void
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void
  onDeleteGoal: (id: string) => void
}

export function DataSidebar({
  open,
  onOpenChange,
  profile,
  assets,
  liabilities,
  incomes,
  expenses,
  goals,
  onUpdateAsset,
  onDeleteAsset,
  onAddAsset,
  onUpdateLiability,
  onDeleteLiability,
  onAddLiability,
  onUpdateIncome,
  onDeleteIncome,
  onAddIncome,
  onUpdateExpense,
  onDeleteExpense,
  onAddExpense,
  onUpdateGoal,
  onDeleteGoal,
}: DataSidebarProps) {
  const [addingAsset, setAddingAsset] = useState(false)
  const [addingLiability, setAddingLiability] = useState(false)
  const [addingIncome, setAddingIncome] = useState(false)
  const [addingExpense, setAddingExpense] = useState(false)

  const [newAssetName, setNewAssetName] = useState('')
  const [newAssetValue, setNewAssetValue] = useState('')
  const [newAssetGrowth, setNewAssetGrowth] = useState('5')

  const [newLiabilityName, setNewLiabilityName] = useState('')
  const [newLiabilityBalance, setNewLiabilityBalance] = useState('')
  const [newLiabilityPayment, setNewLiabilityPayment] = useState('')

  const [newIncomeName, setNewIncomeName] = useState('')
  const [newIncomeAmount, setNewIncomeAmount] = useState('')
  const [newIncomeGrowth, setNewIncomeGrowth] = useState('3')

  const [newExpenseName, setNewExpenseName] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')
  const [newExpenseGrowth, setNewExpenseGrowth] = useState('3')

  const handleAddAsset = () => {
    const value = parseFloat(newAssetValue)
    const growth = parseFloat(newAssetGrowth)
    if (newAssetName && !isNaN(value)) {
      onAddAsset({
        id: generateId(),
        name: newAssetName,
        currentValue: value,
        growthRate: growth,
        startYear: profile.startYear,
      })
      setNewAssetName('')
      setNewAssetValue('')
      setNewAssetGrowth('5')
      setAddingAsset(false)
    }
  }

  const handleAddLiability = () => {
    const balance = parseFloat(newLiabilityBalance)
    const payment = parseFloat(newLiabilityPayment)
    if (newLiabilityName && !isNaN(balance) && !isNaN(payment)) {
      onAddLiability({
        id: generateId(),
        name: newLiabilityName,
        remainingBalance: balance,
        monthlyPayment: payment,
        startYear: profile.startYear,
      })
      setNewLiabilityName('')
      setNewLiabilityBalance('')
      setNewLiabilityPayment('')
      setAddingLiability(false)
    }
  }

  const handleAddIncome = () => {
    const amount = parseFloat(newIncomeAmount)
    const growth = parseFloat(newIncomeGrowth)
    if (newIncomeName && !isNaN(amount)) {
      onAddIncome({
        id: generateId(),
        name: newIncomeName,
        annualAmount: amount,
        growthRate: growth,
        startYear: profile.startYear,
      })
      setNewIncomeName('')
      setNewIncomeAmount('')
      setNewIncomeGrowth('3')
      setAddingIncome(false)
    }
  }

  const handleAddExpense = () => {
    const amount = parseFloat(newExpenseAmount)
    const growth = parseFloat(newExpenseGrowth)
    if (newExpenseName && !isNaN(amount)) {
      onAddExpense({
        id: generateId(),
        name: newExpenseName,
        annualAmount: amount,
        growthRate: growth,
        startYear: profile.startYear,
      })
      setNewExpenseName('')
      setNewExpenseAmount('')
      setNewExpenseGrowth('3')
      setAddingExpense(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Financial Data</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="income" className="mt-6">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="liabilities">Debts</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {incomes.map((income) => (
                  <EditableItemCard
                    key={income.id}
                    name={income.name}
                    amount={income.annualAmount}
                    growthRate={income.growthRate}
                    currency={profile.currency}
                    onEdit={(updates) =>
                      onUpdateIncome(income.id, {
                        name: updates.name,
                        annualAmount: updates.amount,
                        growthRate: updates.growthRate,
                      })
                    }
                    onDelete={() => onDeleteIncome(income.id)}
                  />
                ))}

                {incomes.length === 0 && !addingIncome && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No income sources yet.</p>
                    <p className="text-sm mt-1">Add your first income source to get started.</p>
                  </div>
                )}

                {addingIncome && (
                  <div className="space-y-4 p-4 border-2 border-accent rounded-lg">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newIncomeName}
                        onChange={(e) => setNewIncomeName(e.target.value)}
                        placeholder="e.g., Salary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Amount</Label>
                      <Input
                        type="number"
                        value={newIncomeAmount}
                        onChange={(e) => setNewIncomeAmount(e.target.value)}
                        placeholder="80000"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Annual Growth Rate</Label>
                        <span className="text-sm font-semibold tabular-nums">{newIncomeGrowth}%</span>
                      </div>
                      <Slider
                        value={[parseFloat(newIncomeGrowth)]}
                        onValueChange={([val]) => setNewIncomeGrowth(val.toString())}
                        min={-10}
                        max={20}
                        step={0.5}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddIncome} className="flex-1">
                        Add Income
                      </Button>
                      <Button
                        onClick={() => setAddingIncome(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setAddingIncome(true)}
                  variant="outline"
                  className="w-full"
                  disabled={addingIncome}
                >
                  <Plus className="mr-2" size={16} />
                  Add Income Source
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {expenses.map((expense) => (
                  <EditableItemCard
                    key={expense.id}
                    name={expense.name}
                    amount={expense.annualAmount}
                    growthRate={expense.growthRate}
                    currency={profile.currency}
                    onEdit={(updates) =>
                      onUpdateExpense(expense.id, {
                        name: updates.name,
                        annualAmount: updates.amount,
                        growthRate: updates.growthRate,
                      })
                    }
                    onDelete={() => onDeleteExpense(expense.id)}
                  />
                ))}

                {expenses.length === 0 && !addingExpense && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No expenses yet.</p>
                    <p className="text-sm mt-1">Add your first expense to get started.</p>
                  </div>
                )}

                {addingExpense && (
                  <div className="space-y-4 p-4 border-2 border-accent rounded-lg">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                        placeholder="e.g., Living Expenses"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Amount</Label>
                      <Input
                        type="number"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        placeholder="40000"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Annual Growth Rate</Label>
                        <span className="text-sm font-semibold tabular-nums">{newExpenseGrowth}%</span>
                      </div>
                      <Slider
                        value={[parseFloat(newExpenseGrowth)]}
                        onValueChange={([val]) => setNewExpenseGrowth(val.toString())}
                        min={-10}
                        max={20}
                        step={0.5}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddExpense} className="flex-1">
                        Add Expense
                      </Button>
                      <Button
                        onClick={() => setAddingExpense(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setAddingExpense(true)}
                  variant="outline"
                  className="w-full"
                  disabled={addingExpense}
                >
                  <Plus className="mr-2" size={16} />
                  Add Expense
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {assets.map((asset) => (
                  <EditableItemCard
                    key={asset.id}
                    name={asset.name}
                    amount={asset.currentValue}
                    growthRate={asset.growthRate}
                    currency={profile.currency}
                    onEdit={(updates) =>
                      onUpdateAsset(asset.id, {
                        name: updates.name,
                        currentValue: updates.amount,
                        growthRate: updates.growthRate,
                      })
                    }
                    onDelete={() => onDeleteAsset(asset.id)}
                  />
                ))}

                {assets.length === 0 && !addingAsset && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No assets yet.</p>
                    <p className="text-sm mt-1">Add your first asset to get started.</p>
                  </div>
                )}

                {addingAsset && (
                  <div className="space-y-4 p-4 border-2 border-accent rounded-lg">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                        placeholder="e.g., Savings Account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Value</Label>
                      <Input
                        type="number"
                        value={newAssetValue}
                        onChange={(e) => setNewAssetValue(e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Annual Growth Rate</Label>
                        <span className="text-sm font-semibold tabular-nums">{newAssetGrowth}%</span>
                      </div>
                      <Slider
                        value={[parseFloat(newAssetGrowth)]}
                        onValueChange={([val]) => setNewAssetGrowth(val.toString())}
                        min={-10}
                        max={30}
                        step={0.5}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAsset} className="flex-1">
                        Add Asset
                      </Button>
                      <Button
                        onClick={() => setAddingAsset(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setAddingAsset(true)}
                  variant="outline"
                  className="w-full"
                  disabled={addingAsset}
                >
                  <Plus className="mr-2" size={16} />
                  Add Asset
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="liabilities" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {liabilities.map((liability) => (
                  <EditableItemCard
                    key={liability.id}
                    name={liability.name}
                    amount={liability.remainingBalance}
                    currency={profile.currency}
                    monthlyPayment={liability.monthlyPayment}
                    onEdit={(updates) =>
                      onUpdateLiability(liability.id, {
                        name: updates.name,
                        remainingBalance: updates.amount,
                      })
                    }
                    onEditMonthlyPayment={(payment) =>
                      onUpdateLiability(liability.id, { monthlyPayment: payment })
                    }
                    onDelete={() => onDeleteLiability(liability.id)}
                  />
                ))}

                {liabilities.length === 0 && !addingLiability && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No liabilities yet.</p>
                    <p className="text-sm mt-1">Add any existing loans or debts here.</p>
                  </div>
                )}

                {addingLiability && (
                  <div className="space-y-4 p-4 border-2 border-accent rounded-lg">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newLiabilityName}
                        onChange={(e) => setNewLiabilityName(e.target.value)}
                        placeholder="e.g., Student Loan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Remaining Balance</Label>
                      <Input
                        type="number"
                        value={newLiabilityBalance}
                        onChange={(e) => setNewLiabilityBalance(e.target.value)}
                        placeholder="30000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Payment</Label>
                      <Input
                        type="number"
                        value={newLiabilityPayment}
                        onChange={(e) => setNewLiabilityPayment(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddLiability} className="flex-1">
                        Add Liability
                      </Button>
                      <Button
                        onClick={() => setAddingLiability(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setAddingLiability(true)}
                  variant="outline"
                  className="w-full"
                  disabled={addingLiability}
                >
                  <Plus className="mr-2" size={16} />
                  Add Liability
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {goals.map((goal) => (
                  <EditableGoalCard
                    key={goal.id}
                    goal={goal}
                    profile={profile}
                    onEdit={(updates) => onUpdateGoal(goal.id, updates)}
                    onDelete={() => onDeleteGoal(goal.id)}
                  />
                ))}

                {goals.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No goals yet.</p>
                    <p className="text-sm mt-1">Add financial goals to see them on your chart.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
