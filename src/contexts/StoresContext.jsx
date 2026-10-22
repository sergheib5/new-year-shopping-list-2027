import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addCustomStore, deleteCustomStore, subscribeToStores } from '../firebase/db';
import { DEFAULT_STORES } from '../utils/constants';

const StoresContext = createContext(null);
const normalizeKey = (name) => name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

export const StoresProvider = ({ children }) => {
  const [customStores, setCustomStores] = useState([]);
  const defaultStoreKeys = useMemo(() => new Set(DEFAULT_STORES.map(normalizeKey)), []);

  useEffect(() => subscribeToStores((records) => {
    const names = records
      .map((record) => record.name)
      .filter((name) => typeof name === 'string' && name.trim())
      .filter((name) => !defaultStoreKeys.has(normalizeKey(name)));
    setCustomStores([...new Map(names.map((name) => [normalizeKey(name), name.trim()])).values()].sort((a, b) => a.localeCompare(b)));
  }, (error) => {
    console.error('Custom stores are unavailable; default stores remain active.', error);
  }), [defaultStoreKeys]);

  const stores = useMemo(() => [
    ...DEFAULT_STORES.slice(0, -1),
    ...customStores,
    DEFAULT_STORES[DEFAULT_STORES.length - 1]
  ], [customStores]);

  const addStore = useCallback(async (rawName) => {
    const name = rawName.trim().replace(/\s+/g, ' ');
    const nameKey = normalizeKey(name);
    if (stores.some((store) => normalizeKey(store) === nameKey)) {
      throw new Error('That store is already in the list.');
    }

    const savedName = await addCustomStore(name);
    setCustomStores((current) => (
      current.some((store) => normalizeKey(store) === nameKey)
        ? current
        : [...current, savedName].sort((a, b) => a.localeCompare(b))
    ));
    return savedName;
  }, [stores]);

  const removeStore = useCallback(async (rawName) => {
    const nameKey = normalizeKey(rawName);
    if (defaultStoreKeys.has(nameKey)) throw new Error('Built-in stores can’t be removed.');
    await deleteCustomStore(rawName);
    setCustomStores((current) => current.filter((store) => normalizeKey(store) !== nameKey));
  }, [defaultStoreKeys]);

  const value = useMemo(() => ({ stores, customStores, addStore, removeStore }), [stores, customStores, addStore, removeStore]);
  return <StoresContext.Provider value={value}>{children}</StoresContext.Provider>;
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (!context) throw new Error('useStores must be used within StoresProvider.');
  return context;
};
