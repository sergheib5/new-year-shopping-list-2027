import { useState, useRef, useEffect } from 'react';
import { STORES } from '../utils/constants';
import useSalads from '../hooks/useSalads';
import './InlineAddRow.css';

const InlineAddRow = ({ onSave }) => {
  const salads = useSalads();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    store: 'Fresh Farm',
    salad: 'General',
    quantity: ''
  });

  const nameInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Focus on item name input when component mounts
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Keep focus on name input for continuous flow
  useEffect(() => {
    // Focus on name input when form is empty (after saving)
    const isEmpty = !formData.name.trim() && !formData.quantity.trim();
    if (isEmpty && nameInputRef.current) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.name, formData.quantity, formData.salad]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name || isSaving) return;

    setIsSaving(true);
    setSaveError('');
    try {
      await onSave({ ...formData, name });
      setFormData({
        name: '',
        store: formData.store,
        salad: formData.salad,
        quantity: ''
      });
      setTimeout(() => nameInputRef.current?.focus(), 0);
    } catch (error) {
      setSaveError(error?.message || 'Could not save this item. Your entry is still here; please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (formData.name.trim()) {
        void handleSubmit(e);
      } else {
        // If name is empty, just focus on name input
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      // Clear form if it has content
      if (formData.name.trim() || formData.quantity.trim()) {
        setFormData({
          name: '',
          store: 'Fresh Farm',
          salad: 'General',
          quantity: ''
        });
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }
    }
  };

  return (
    <form className="inline-add-row" onSubmit={handleSubmit} ref={formRef}>
      <div className="col-item-wide">
        <input
          ref={nameInputRef}
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Item name"
          aria-label="Item name"
          className="inline-input item-input"
          required
          disabled={isSaving}
        />
      </div>
      <div className="col-quantity-compact col-quantity-first">
        <input
          type="text"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Qty"
          aria-label="Quantity"
          className="inline-input quantity-input"
          disabled={isSaving}
        />
      </div>
      <div className="col-store-compact">
        <select
          value={formData.store}
          onChange={(e) => handleChange('store', e.target.value)}
          className="inline-select"
          onKeyDown={handleKeyDown}
          title={formData.store}
          aria-label="Store"
          disabled={isSaving}
        >
          {STORES.map(store => (
            <option key={store} value={store}>{store}</option>
          ))}
        </select>
      </div>
      <div className="col-salad-compact">
        <select
          value={formData.salad}
          onChange={(e) => handleChange('salad', e.target.value)}
          className="inline-select"
          onKeyDown={handleKeyDown}
          title={formData.salad}
          aria-label="List or meal"
          disabled={isSaving}
        >
          <option value="General">General</option>
          {salads.map(salad => (
            <option key={salad} value={salad}>{salad}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="inline-add-submit" disabled={isSaving || !formData.name.trim()}>
        {isSaving ? 'Saving…' : 'Add item'}
      </button>
      {saveError && <p className="inline-add-error" role="alert">{saveError}</p>}
    </form>
  );
};

export default InlineAddRow;
