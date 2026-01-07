import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UserProfile } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProfileSetupDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onComplete: (profile: UserProfile) => void
  initialProfile?: UserProfile
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
]

export function ProfileSetupDialog({ open, onOpenChange, onComplete, initialProfile }: ProfileSetupDialogProps) {
  const [name, setName] = useState(initialProfile?.name || '')
  const [currentAge, setCurrentAge] = useState(initialProfile?.currentAge?.toString() || '')
  const [planningHorizonAge, setPlanningHorizonAge] = useState(
    initialProfile?.planningHorizonAge?.toString() || ''
  )
  const [currency, setCurrency] = useState(initialProfile?.currency || 'USD')

  useEffect(() => {
    if (open && initialProfile) {
      setName(initialProfile.name || '')
      setCurrentAge(initialProfile.currentAge?.toString() || '')
      setPlanningHorizonAge(initialProfile.planningHorizonAge?.toString() || '')
      setCurrency(initialProfile.currency || 'USD')
    }
  }, [open, initialProfile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const ageNum = parseInt(currentAge)
    const horizonNum = parseInt(planningHorizonAge)
    
    if (!name || isNaN(ageNum) || isNaN(horizonNum) || horizonNum <= ageNum) {
      return
    }

    onComplete({
      name,
      currentAge: ageNum,
      planningHorizonAge: horizonNum,
      currency,
      startYear: new Date().getFullYear(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[500px]",
          !initialProfile && "[&>button[data-slot=dialog-close]]:hidden"
        )} 
        onInteractOutside={(e) => (initialProfile ? undefined : e.preventDefault())}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Setup Your Financial Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-age">Current Age</Label>
              <Input
                id="current-age"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                placeholder="25"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horizon-age">Planning Until Age</Label>
              <Input
                id="horizon-age"
                type="number"
                value={planningHorizonAge}
                onChange={(e) => setPlanningHorizonAge(e.target.value)}
                placeholder="65"
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue to Planning
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
