import { useState, useMemo, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, List, User, Question } from '@phosphor-icons/react'
import { ProfileSetupDialog } from '@/components/ProfileSetupDialog'
import { DataSidebar } from '@/components/DataSidebar'
import { AddGoalDialog } from '@/components/AddGoalDialog'
import { FinancialChart } from '@/components/FinancialChart'
import { TutorialDialog } from '@/components/TutorialDialog'
import { calculateProjections, formatCurrency } from '@/lib/calculations'
import type { UserProfile, Asset, Liability, Income, Expense, Goal } from '@/lib/types'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('user-profile', null)
  const [tutorialCompleted, setTutorialCompleted] = useLocalStorage<boolean>('tutorial-completed', false)
  const [assets, setAssets] = useLocalStorage<Asset[]>('assets', [])
  const [liabilities, setLiabilities] = useLocalStorage<Liability[]>('liabilities', [])
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', [])
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', [])
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', [])

  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showDataSidebar, setShowDataSidebar] = useState(false)
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [showTutorialDialog, setShowTutorialDialog] = useState(false)

  useEffect(() => {
    if (!profile) {
      setShowProfileDialog(true)
    } else if (!tutorialCompleted) {
      setShowTutorialDialog(true)
    }
  }, [profile, tutorialCompleted])

  const normalizedAssets = useMemo(() => {
    return (assets || []).map((asset) => ({
      ...asset,
      risk: asset.risk ?? 0,
    }))
  }, [assets])

  const projections = useMemo(() => {
    if (!profile || !normalizedAssets || !liabilities || !incomes || !expenses || !goals) return []
    return calculateProjections(profile, normalizedAssets, liabilities, incomes, expenses, goals)
  }, [profile, normalizedAssets, liabilities, incomes, expenses, goals])

  const currentNetWorth = useMemo(() => {
    if (projections.length === 0) return 0
    return projections[0].netWorth
  }, [projections])

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile)
    setShowProfileDialog(false)
    if (!tutorialCompleted) {
      setShowTutorialDialog(true)
    }
    toast.success('Profile created successfully!')
  }

  const handleTutorialComplete = () => {
    setTutorialCompleted(true)
    setShowTutorialDialog(false)
  }

  const handleUpdateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((current) => (current || []).map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const handleDeleteAsset = (id: string) => {
    setAssets((current) => (current || []).filter((a) => a.id !== id))
    toast.success('Asset deleted')
  }

  const handleAddAsset = (asset: Asset) => {
    setAssets((current) => [...(current || []), asset])
    toast.success('Asset added')
  }

  const handleUpdateLiability = (id: string, updates: Partial<Liability>) => {
    setLiabilities((current) => (current || []).map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const handleDeleteLiability = (id: string) => {
    setLiabilities((current) => (current || []).filter((l) => l.id !== id))
    toast.success('Liability deleted')
  }

  const handleAddLiability = (liability: Liability) => {
    setLiabilities((current) => [...(current || []), liability])
    toast.success('Liability added')
  }

  const handleUpdateIncome = (id: string, updates: Partial<Income>) => {
    setIncomes((current) => (current || []).map((i) => (i.id === id ? { ...i, ...updates } : i)))
  }

  const handleDeleteIncome = (id: string) => {
    setIncomes((current) => (current || []).filter((i) => i.id !== id))
    toast.success('Income source deleted')
  }

  const handleAddIncome = (income: Income) => {
    setIncomes((current) => [...(current || []), income])
    toast.success('Income source added')
  }

  const handleUpdateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((current) => (current || []).map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((current) => (current || []).filter((e) => e.id !== id))
    toast.success('Expense deleted')
  }

  const handleAddExpense = (expense: Expense) => {
    setExpenses((current) => [...(current || []), expense])
    toast.success('Expense added')
  }

  const handleAddGoal = (goal: Goal) => {
    setGoals((current) => [...(current || []), goal])
    toast.success('Goal added to your plan!')
  }

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((current) => (current || []).map((g) => (g.id === id ? { ...g, ...updates } : g)))
    toast.success('Goal updated')
  }

  const handleDeleteGoal = (id: string) => {
    setGoals((current) => (current || []).filter((g) => g.id !== id))
    toast.success('Goal deleted')
  }

  const handleImportData = (data: {
    profile: UserProfile
    assets: Asset[]
    liabilities: Liability[]
    incomes: Income[]
    expenses: Expense[]
    goals: Goal[]
  }) => {
    setProfile(data.profile)
    setAssets(data.assets)
    setLiabilities(data.liabilities)
    setIncomes(data.incomes)
    setExpenses(data.expenses)
    setGoals(data.goals)
    toast.success('Data imported successfully')
  }

  if (!profile) {
    return (
      <>
        <ProfileSetupDialog 
          open={showProfileDialog} 
          onOpenChange={() => {}}
          onComplete={handleProfileComplete} 
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">goals.cash</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.name}'s Financial Plan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Card className="px-4 py-2">
                <p className="text-xs text-muted-foreground">Current Net Worth</p>
                <p className="text-xl font-semibold tabular-nums">
                  {formatCurrency(currentNetWorth, profile.currency)}
                </p>
              </Card>
              <Button variant="ghost" size="icon" onClick={() => setShowTutorialDialog(true)} title="Help & Tutorial">
                <Question size={20} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowProfileDialog(true)}>
                <User className="mr-2" size={16} />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-6 mb-6">
          <Button onClick={() => setShowGoalDialog(true)} size="lg">
            <Target className="mr-2" size={20} />
            Add Financial Goal
          </Button>
          <Button onClick={() => setShowDataSidebar(true)} variant="outline" size="lg">
            <List className="mr-2" size={20} />
            Manage Data
          </Button>
        </div>

        {projections.length > 0 ? (
          <FinancialChart projections={projections} currency={profile.currency} goals={goals || []} />
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Start Building Your Financial Plan</h3>
            <p className="text-muted-foreground mb-6">
              Add your income, expenses, assets, and liabilities to see your financial projections.
            </p>
            <Button onClick={() => setShowDataSidebar(true)} size="lg">
              <List className="mr-2" size={20} />
              Add Financial Data
            </Button>
          </Card>
        )}
      </main>

      <ProfileSetupDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onComplete={handleProfileComplete}
        initialProfile={profile}
      />

      <TutorialDialog
        open={showTutorialDialog}
        onOpenChange={setShowTutorialDialog}
        onComplete={handleTutorialComplete}
      />

      <DataSidebar
        open={showDataSidebar}
        onOpenChange={setShowDataSidebar}
        profile={profile}
        assets={normalizedAssets || []}
        liabilities={liabilities || []}
        incomes={incomes || []}
        expenses={expenses || []}
        goals={goals || []}
        onUpdateAsset={handleUpdateAsset}
        onDeleteAsset={handleDeleteAsset}
        onAddAsset={handleAddAsset}
        onUpdateLiability={handleUpdateLiability}
        onDeleteLiability={handleDeleteLiability}
        onAddLiability={handleAddLiability}
        onUpdateIncome={handleUpdateIncome}
        onDeleteIncome={handleDeleteIncome}
        onAddIncome={handleAddIncome}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
        onAddExpense={handleAddExpense}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
        onImportData={handleImportData}
      />

      <AddGoalDialog
        open={showGoalDialog}
        onOpenChange={setShowGoalDialog}
        onAdd={handleAddGoal}
        profile={profile}
      />

      <Toaster />
    </div>
  )
}

export default App