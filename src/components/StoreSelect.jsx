import { useState } from 'react';
import { useStores } from '../contexts/StoresContext';
import AddStoreDialog from './AddStoreDialog';

const ADD_STORE_VALUE = '__add_new_store__';

const StoreSelect = ({ value, onChange, id, name, className = 'inline-select', disabled = false, ariaLabel = 'Store', onBlur, onKeyDown, title }) => {
  const { stores } = useStores();
  const [showAddStore, setShowAddStore] = useState(false);

  const handleChange = (event) => {
    if (event.target.value === ADD_STORE_VALUE) {
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
        <option value={ADD_STORE_VALUE}>＋ Add a store…</option>
      </select>
      {showAddStore && (
        <AddStoreDialog
          onAdded={(store) => {
            onChange(store);
            setShowAddStore(false);
          }}
          onCancel={() => setShowAddStore(false)}
        />
      )}
    </>
  );
};

export default StoreSelect;
