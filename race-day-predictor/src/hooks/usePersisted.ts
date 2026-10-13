import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function usePersisted<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `rdp:${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode, quota). Ignore. */
    }
  }, [storageKey, value]);
  return [value, setValue];
}
