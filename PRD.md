# Planning Guide

A comprehensive personal financial planning tool that helps users model their financial future, visualize wealth accumulation, and plan for major life goals through detailed income, expense, asset, and liability tracking with growth projections.

**Experience Qualities**:
1. **Empowering** - Users should feel in control of their financial future, with clear visibility into how their decisions impact long-term outcomes
2. **Analytical** - The interface should support deep financial modeling with precise controls, growth rates, and compound calculations
3. **Insightful** - Visualizations should reveal financial trends and goal feasibility at a glance through rich, layered charts

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a sophisticated financial modeling tool with multiple interconnected data types (assets, liabilities, income, expenses, goals), complex calculations (compound growth, loan amortization), interactive visualizations, and persistent state management across planning horizons.

## Essential Features

### User Profile Setup
- **Functionality**: Initial configuration of personal details and planning parameters
- **Purpose**: Establish the foundation for all financial projections
- **Trigger**: First-time app launch or profile settings access
- **Progression**: Open profile dialog → Enter name, current age, planning horizon age, currency → Save → Proceed to data entry
- **Success criteria**: Profile data persists and currency/age constraints apply to all calculations

### Asset Management
- **Functionality**: Track multiple assets with monetary values, annual growth rates, and risk/volatility levels
- **Purpose**: Model wealth accumulation from savings, investments, stocks, real estate, etc. with realistic market volatility
- **Trigger**: Add Asset button in sidebar Assets tab
- **Progression**: Click Add Asset → Enter asset name, current value, growth rate %, risk level (0-100%) → Save → Asset appears in list and calculations
- **Success criteria**: Assets compound annually at variable rates based on risk setting; 0% risk = constant growth, 100% risk = growth varies from -x% to +2x% each year (randomized per render)

### Liability Management
- **Functionality**: Track loans and debts with remaining balance and monthly payments
- **Purpose**: Model debt paydown and its impact on net worth
- **Trigger**: Add Liability button in sidebar Liabilities tab
- **Progression**: Click Add Liability → Enter name, remaining balance, monthly payment → Save → Liability decreases monthly in projections
- **Success criteria**: Liabilities reduce by payment amounts until paid off, impacting net worth appropriately

### Income Tracking
- **Functionality**: Multiple income sources with annual growth rates
- **Purpose**: Project earning potential and model salary increases, side income, etc.
- **Trigger**: Add Income button in sidebar Income tab
- **Progression**: Click Add Income → Enter income name, annual amount, growth rate % → Save → Income stacks in chart
- **Success criteria**: Income grows annually and contributes to net worth increase each year

### Expense Tracking
- **Functionality**: Multiple expense categories with individual growth rates
- **Purpose**: Model living costs, inflation, and lifestyle changes
- **Trigger**: Add Expense button in sidebar Expenses tab
- **Progression**: Click Add Expense → Enter expense name, annual amount, growth rate % → Save → Expense stacks in chart (below zero or toggle view)
- **Success criteria**: Expenses grow annually and reduce net worth each year

### Financial Visualization
- **Functionality**: Dual-chart system showing income/expense bars and net worth area chart
- **Purpose**: Provide immediate visual feedback on financial trajectory
- **Trigger**: Automatic upon data entry
- **Progression**: Data entered → Charts update in real-time → Hover for details → Toggle expense view mode
- **Success criteria**: Charts accurately reflect projections, support hover tooltips, and toggle between expense visualization modes

### Goal Planning
- **Functionality**: Add and edit financial goals as one-time purchases, recurring expenses, or liabilities (with loans)
- **Purpose**: Model major life events and their financial impact
- **Trigger**: Add Goal button on main interface, or edit existing goals in Manage Data sidebar
- **Progression**: Click Add Goal → Select type (one-time/recurring) → Enter details (amount, year, loan terms if applicable) → Save → Goal appears as point on chart with projected impact. Edit goals via Manage Data sidebar → Goals tab → Click edit on any goal
- **Success criteria**: Goals modify projections appropriately (one-time reduces assets, recurring adds expenses, loans add liabilities). Goals can be edited and deleted after creation.

### Interactive Editing
- **Functionality**: Adjust growth rates and amounts via sliders and inputs
- **Purpose**: Enable quick scenario modeling and what-if analysis
- **Trigger**: Click edit on any income/expense/asset/liability item
- **Progression**: Click edit → Adjust sliders/inputs → Changes reflect immediately in charts → Save or cancel
- **Success criteria**: Real-time chart updates, smooth slider interactions, changes persist

## Edge Case Handling

- **Negative Net Worth**: Charts display red shaded area below zero axis when liabilities exceed assets
- **Liabilities Paid Off**: Monthly payments stop when liability balance reaches zero
- **Empty States**: Helpful prompts guide users to add their first income/expense/asset when categories are empty
- **Planning Horizon Validation**: Cannot set planning age lower than current age
- **Invalid Growth Rates**: Negative growth rates allowed (depreciation), but UI warns on extreme values (>50% or <-50%)
- **Goal Year Out of Range**: Goals must be within planning horizon (current age to target age)
- **Currency Formatting**: All values display with appropriate locale-specific formatting

## Design Direction

The design should evoke **confidence, precision, and clarity** - like a professional financial planning tool that puts powerful analytics in the user's hands. The interface should feel data-rich but not overwhelming, with charts taking center stage and controls organized logically in an accessible sidebar. Visual feedback should be immediate, with smooth transitions and clear hierarchies guiding users through complex financial modeling.

## Color Selection

**Financial Professional Aesthetic** - A sophisticated palette that balances trust (blues) with growth optimism (greens) and clear warnings (reds).

- **Primary Color**: Deep Professional Blue `oklch(0.45 0.15 250)` - Conveys trust, stability, and financial expertise. Used for primary actions and key UI elements.
- **Secondary Colors**: 
  - Wealth Green `oklch(0.55 0.15 150)` for positive net worth, asset growth, and income visualization
  - Liability Red `oklch(0.55 0.18 20)` for debts, negative balances, and expenses
  - Neutral Slate `oklch(0.65 0.02 250)` for secondary UI elements and muted states
- **Accent Color**: Vibrant Teal `oklch(0.60 0.14 200)` - Eye-catching for goals, highlights, and interactive elements. Draws attention without alarming.
- **Foreground/Background Pairings**:
  - Background (Cool White `oklch(0.98 0.005 250)`): Foreground (Deep Charcoal `oklch(0.20 0.01 250)`) - Ratio 16.5:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Accent (Vibrant Teal `oklch(0.60 0.14 200)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓
  - Wealth Green area: Uses 20% opacity over white for subtle positive zone
  - Liability Red area: Uses 20% opacity over white for subtle negative zone

## Font Selection

**Clarity meets sophistication** - A font pairing that handles dense financial data while maintaining professional elegance.

- **Primary Font**: Space Grotesk - Modern geometric sans with excellent readability for both UI labels and numerical data. Conveys technical precision without feeling cold.
- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 32px / -0.02em letter spacing / leading-tight
  - H2 (Section Headers): Space Grotesk SemiBold / 24px / -0.01em / leading-snug
  - H3 (Card Titles): Space Grotesk Medium / 18px / 0em / leading-normal
  - Body (Labels): Space Grotesk Regular / 14px / 0em / leading-relaxed
  - Large Numbers (Financial Values): Space Grotesk SemiBold / 28px / -0.01em / tabular-nums
  - Small Numbers (Chart Labels): Space Grotesk Regular / 12px / 0em / tabular-nums
  - Button Text: Space Grotesk Medium / 14px / 0.01em

## Animations

**Purposeful precision** - Animations should reinforce the feeling of a responsive, intelligent system that reacts to user input with calculated confidence. Chart transitions should be smooth and data-driven (200-300ms ease-out) when values update. Sidebar panels slide open with subtle spring physics (framer-motion) to feel premium. Goal markers pulse gently on hover (scale 1.0 to 1.1) to invite interaction. Number changes should use subtle count-up animations for large value shifts to help users track changes.

## Component Selection

- **Components**:
  - **Dialog**: Profile setup modal and Add Goal dialog for creating new goals
  - **Tabs**: Sidebar navigation between Income/Expenses/Assets/Liabilities/Goals sections
  - **Card**: Container for individual income/expense/asset/liability/goal items with edit controls
  - **Slider**: Primary control for adjusting growth rates (visual, immediate feedback)
  - **Input**: Precise numerical entry for amounts and percentages
  - **Button**: Primary (Add Goal, Save), Secondary (Add Income/Expense/Asset), Destructive (Delete items)
  - **Sheet**: Right sidebar containing tabbed data management panels
  - **Tooltip**: Hover details for chart data points and goal markers
  - **Separator**: Visual division between sidebar sections
  - **Badge**: Display growth rates and status indicators
  - **ScrollArea**: Scrollable lists within sidebar tabs
  - **Select**: Currency selection, goal type selection, year selection for goals
  - **RadioGroup**: Goal type selection (one-time vs recurring, with loan vs without loan)
  
- **Customizations**:
  - **Chart Container**: Custom D3/Recharts integration with dual-axis support (bars + area chart overlaid)
  - **Goal Markers**: Custom SVG circles with hover states positioned on timeline
  - **Toggle Button**: Custom expense view toggle (negative vs same-side bars)
  - **Editable Card**: Custom component combining Card + Slider + Input with inline editing
  - **Editable Goal Card**: Custom component for editing goals with conditional fields based on goal type (one-time, recurring, with/without loan)
  
- **States**:
  - Buttons: Subtle shadow on hover, slight scale on press (0.98), disabled shows muted colors
  - Sliders: Track highlights as thumb moves, value displays in tooltip above thumb
  - Inputs: Focus shows accent border with subtle glow, error state shows red border
  - Cards: Hover lifts with shadow increase, active/editing state shows accent border
  - Goal markers: Default size 12px, hover scales to 16px with tooltip
  
- **Icon Selection**:
  - Plus (CirclePlus): Add new items
  - TrendUp/TrendDown: Growth indicators
  - Wallet: Assets
  - CreditCard: Liabilities  
  - Coins: Income
  - Receipt: Expenses
  - Target: Goals
  - Pencil: Edit mode
  - Trash: Delete items
  - Eye/EyeSlash: Toggle expense view
  - ChartLineUp: Visualization section
  
- **Spacing**:
  - Page padding: `p-6` (24px) on desktop, `p-4` (16px) on mobile
  - Card gaps: `gap-4` (16px) between cards in sidebar
  - Form element spacing: `gap-3` (12px) between label and input
  - Section spacing: `gap-6` (24px) between major sections
  - Chart margins: `m-8` (32px) around chart area
  
- **Mobile**:
  - Sidebar converts to bottom drawer/sheet on mobile (<768px)
  - Chart takes full width, tabs move to horizontal scrolling strip
  - Sliders stack vertically below labels instead of inline
  - Profile info collapses to icon button with sheet
  - Goal markers increase to 16px minimum for touch targets
  - Number inputs get larger hit areas (min-h-12)
