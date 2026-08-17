import { useEffect, useState } from "react";

/**
 * Reads a CSS custom property (must resolve to an actual color value, not a
 * nested var(...) reference) from :root, with a fallback for the first
 * render before the DOM is available. Re-reads on mount only - these are
 * theme tokens, not expected to change at runtime.
 */
export function useCssColor(varName: string, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (value) setColor(value);
  }, [varName]);

  return color;
}
