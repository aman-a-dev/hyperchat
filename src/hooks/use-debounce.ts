import { useState, useEffect } from "react";

/**
 * @description: A custom hook that delays updating a value until after a specified delay has passed since the last change.
 * @param value - The value to debounce (can be any type).
 * @param delay - The delay in milliseconds (default: 500ms).
 * @returns The debounced value.
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on component unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default useDebounce;