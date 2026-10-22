import { useState, useRef } from 'react';
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
    <form className="inline-add-row" onSubmit={handleSubmit}>
      <div className="col-item-wide">
        <label className="inline-field-label" htmlFor="new-item-name">Item</label>
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
        <label className="inline-field-label" htmlFor="new-item-quantity">Quantity</label>
        <input
          id="new-item-quantity"
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
        <label className="inline-field-label" htmlFor="new-item-store">Store</label>
        <select
          id="new-item-store"
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
      {salads.length > 0 ? (
        <div className="col-salad-compact">
          <label className="inline-field-label" htmlFor="new-item-meal">Meal (optional)</label>
          <select
            id="new-item-meal"
            value={formData.salad}
            onChange={(e) => handleChange('salad', e.target.value)}
            className="inline-select"
            onKeyDown={handleKeyDown}
            title={formData.salad}
            aria-label="Meal (optional)"
            disabled={isSaving}
          >
            <option value="General">No meal</option>
            {salads.map(salad => (
              <option key={salad} value={salad}>{salad}</option>
            ))}
          </select>
        </div>
      ) : (
        <p className="inline-add-note">No meal links yet. Items stay on your shopping list; add a salad in Menu if you want to group groceries by recipe.</p>
      )}
      <button type="submit" className="inline-add-submit" disabled={isSaving || !formData.name.trim()}>
        {isSaving ? 'Saving…' : 'Add item'}
      </button>
      {saveError && <p className="inline-add-error" role="alert">{saveError}</p>}
    </form>
  );
};

export default InlineAddRow;
