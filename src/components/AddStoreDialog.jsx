import { useEffect, useRef, useState } from 'react';
import { useStores } from '../contexts/StoresContext';
import './AddStoreDialog.css';

const AddStoreDialog = ({ onAdded, onCancel }) => {
  const { addStore, stores } = useStores();
  const dialogRef = useRef(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else if (!dialog.open) dialog.setAttribute('open', '');
    return () => {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanedName = name.trim().replace(/\s+/g, ' ');
    if (!cleanedName) {
      setError('Enter a store name.');
      return;
    }
    if (cleanedName.length > 40) {
      setError('Use 40 characters or fewer.');
      return;
    }
    if (stores.some((store) => store.toLocaleLowerCase() === cleanedName.toLocaleLowerCase())) {
      setError('That store is already in the list.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const savedName = await addStore(cleanedName);
      onAdded(savedName);
    } catch (saveError) {
      setError(saveError?.message || 'Could not add this store. Try again.');
      setIsSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="add-store-dialog"
      aria-labelledby="add-store-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="add-store-icon" aria-hidden="true">🏬</div>
        <h2 id="add-store-title">Add a store</h2>
        <p>It will be available to everyone using this shopping list.</p>
        <label htmlFor="new-store-name">Store name</label>
        <input
          id="new-store-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          maxLength={40}
          autoFocus
          autoComplete="organization"
          placeholder="e.g., Trader Joe’s"
          disabled={isSaving}
        />
        {error && <p className="add-store-error" role="alert">{error}</p>}
        <div className="add-store-actions">
          <button type="button" className="add-store-cancel" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" className="add-store-submit" disabled={isSaving || !name.trim()}>
            {isSaving ? 'Adding…' : 'Add store'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddStoreDialog;
