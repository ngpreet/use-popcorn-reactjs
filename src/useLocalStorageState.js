import { useState, useEffect } from "react";

export function useLocalStorageState(initialValue, key) {
  const [value, setValue] = useState(function () {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialValue;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
