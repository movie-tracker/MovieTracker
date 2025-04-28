import { useEffect, useState } from "react";

function useLocalStorage(key: string, initialValue?: string) {
  const storedValue = localStorage.getItem(key);

  const [state, setState] = useState<string | null>(
    storedValue ?? initialValue ?? null
  );

  const setLocalStorage = (value: string | null) => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }

    setState(value);
  };

  useEffect(() => {
    setState(storedValue);
  }, [storedValue]);

  return [state, setLocalStorage] as const;
}

export default useLocalStorage;
