
/**
 * A random color for income stream
 * This should be a color in shade of green
 * The output should be in string format that works with chart.js
 * Every time this function is called, it should return a different color
 */
export function getRandomIncomeColor(): string {
  // Generate random green color with high saturation
  const hue = 120; // Green hue
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 30 + Math.floor(Math.random() * 30); // 30-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * A random color for expense stream
 * This should be a color in shade of red
 * The output should be in string format that works with chart.js
 * Every time this function is called, it should return a different color
 */
export function getRandomExpenseColor(): string {
  // Generate random red color with high saturation
  const hue = 0; // Red hue
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 30 + Math.floor(Math.random() * 30); // 30-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * A random color for asset pool
 * This should be a color in shade of cyan
 * The output should be in string format that works with chart.js
 * Every time this function is called, it should return a different color
 */
export function getRandomAssetColor(): string {
  // Generate random blue color with high saturation
  const hue = 180; // Teal cyan
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 30 + Math.floor(Math.random() * 30); // 30-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * A random color for liability pool
 * This should be a color in shade of orange
 * The output should be in string format that works with chart.js
 * Every time this function is called, it should return a different color
 */
export function getRandomLiabilityColor(): string {
  // Generate random orange color with high saturation
  const hue = 40; // Orange hue
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 30 + Math.floor(Math.random() * 30); // 30-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}