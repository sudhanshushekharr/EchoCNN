export const getColor = (value: number): [number, number, number] => {
  // Ensure value is within reasonable bounds
  const clampedValue = Math.max(-1, Math.min(1, value));
  
  // Normalize value to 0-1 range
  const normalizedValue = (clampedValue + 1) / 2;
  
  let r, g, b;
  
  if (normalizedValue < 0.5) {
    // Blue to white gradient for negative values
    const t = normalizedValue * 2;
    r = Math.round(255 * t);
    g = Math.round(255 * t);
    b = 255;
  } else {
    // White to red gradient for positive values
    const t = (normalizedValue - 0.5) * 2;
    r = 255;
    g = Math.round(255 * (1 - t));
    b = Math.round(255 * (1 - t));
  }
  
  return [r, g, b];
};