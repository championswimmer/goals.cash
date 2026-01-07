import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  Bank, 
  TrendUp, 
  Wallet, 
  Receipt, 
  Target 
} from '@phosphor-icons/react'

interface TutorialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

const steps = [
  {
    title: "Add Assets",
    description: "Start by adding your current assets. You can add cash (more stable) and stocks (more volatile).",
    details: "Your assets are the foundation of your financial plan. Different assets have different growth rates and risk profiles.",
    icon: Bank
  },
  {
    title: "Add Income",
    description: "Add your salary and other income sources like side gigs separately.",
    details: "Do NOT add income from interest of assets here. Asset growth is already handled in the Assets section.",
    icon: TrendUp
  },
  {
    title: "Add Expenses",
    description: "Add recurring expenses like rent, living costs, and travel.",
    details: "You can specify 'x number of years' for temporary expenses. Do NOT add loan repayments here; those belong in Liabilities.",
    icon: Wallet
  },
  {
    title: "Add Liabilities",
    description: "Add any ongoing loans, mortgages, or other debts.",
    details: "Liabilities have a repayment cadence. This separates debt repayment from your regular living expenses.",
    icon: Receipt
  },
  {
    title: "Set Goals",
    description: "Once your data is entered, start adding your financial goals.",
    details: "See if your goals fit your financial plan based on your assets, income, and expenses.",
    icon: Target
  }
]

export function TutorialDialog({ open, onOpenChange, onComplete }: TutorialDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0)
    }
  }, [open])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const CurrentIcon = steps[currentStep].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <CurrentIcon size={32} weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{steps[currentStep].title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Step {currentStep + 1} of {steps.length}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-lg font-medium">{steps[currentStep].description}</p>
          <p className="text-muted-foreground">{steps[currentStep].details}</p>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tutorial
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
