export function useLocalStorage() {
  const saveToSession = (keys) => {
    keys.forEach((item) => {
      const value = sessionStorage.getItem(item);
      if (value) {
        sessionStorage.setItem(item, value);
      }
    });
  };

  const restoreFromSession = (keys) => {
    keys.forEach((item) => {
      const savedValue = sessionStorage.getItem(item);
      if (savedValue) {
        sessionStorage.setItem(item, savedValue);
      }
    });
  };

  const removeFromLocalStorage = (keys) => {
    keys.forEach((item) => {
      localStorage.removeItem(item);
    });
  };

  return {
    saveToSession,
    restoreFromSession,
    removeFromLocalStorage,
  };
}
