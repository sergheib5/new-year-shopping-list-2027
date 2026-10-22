import { useState } from 'react';
import { useStores } from '../contexts/StoresContext';
import AddStoreDialog from './AddStoreDialog';

const MANAGE_STORES_VALUE = '__manage_stores__';

const StoreSelect = ({ value, onChange, id, name, className = 'inline-select', disabled = false, ariaLabel = 'Store', onBlur, onKeyDown, title }) => {
  const { stores } = useStores();
  const [showAddStore, setShowAddStore] = useState(false);

  const handleChange = (event) => {
    if (event.target.value === MANAGE_STORES_VALUE) {
      setShowAddStore(true);
      return;
    }
    onChange(event.target.value);
  };

  return (
    <>
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        title={title}
      >
        {stores.map((store) => <option key={store} value={store}>{store}</option>)}
        <option disabled>──────────</option>
        <option value={MANAGE_STORES_VALUE}>＋ Manage stores…</option>
      </select>
      {showAddStore && (
        <AddStoreDialog
          onAdded={(store) => {
            onChange(store);
            setShowAddStore(false);
          }}
          onDeleted={(store) => {
            if (value === store) onChange('Other');
          }}
          onCancel={() => setShowAddStore(false)}
        />
      )}
    </>
  );
};

export default StoreSelect;
