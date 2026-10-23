import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStores } from '../contexts/StoresContext';
import { getStoreColor } from '../utils/constants';
import AddStoreDialog from './AddStoreDialog';
import './StoreSelect.css';

const StoreSelect = ({ value, onChange, id, name, className = 'inline-select', disabled = false, ariaLabel = 'Store', onBlur, onKeyDown, title }) => {
  const { stores } = useStores();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [popoverMaxHeight, setPopoverMaxHeight] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const popoverRef = useRef(null);
  const selectedIndex = Math.max(0, stores.indexOf(value));

  useLayoutEffect(() => {
    if (!isOpen || !popoverRef.current || !triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const fullHeight = popoverRef.current.scrollHeight;
    const reservedBottom = 88;
    const availableBelow = window.innerHeight - triggerRect.bottom - reservedBottom;
    const availableAbove = triggerRect.top - 12;
    const shouldOpenUpward = fullHeight > availableBelow && availableAbove > availableBelow;
    const available = shouldOpenUpward ? availableAbove : availableBelow;
    setOpenUpward(shouldOpenUpward);
    setPopoverMaxHeight(Math.max(180, Math.min(fullHeight, available)));
  }, [isOpen, stores.length]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onBlur]);

  const openAt = (index = selectedIndex) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const selectStore = (store) => {
    onChange(store);
    setIsOpen(false);
    triggerRef.current?.focus();
    window.setTimeout(() => onBlur?.(), 0);
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(selectedIndex);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAt(selectedIndex);
      return;
    }
    onKeyDown?.(event);
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (index + direction + stores.length) % stores.length;
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      optionRefs.current[event.key === 'Home' ? 0 : stores.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectStore(stores[index]);
    } else if (event.key === 'Tab') {
      setIsOpen(false);
      onBlur?.();
    }
  };

  const openManageStores = () => {
    setIsOpen(false);
    setShowAddStore(true);
  };

  return (
    <>
      <div className="store-picker" ref={rootRef}>
        <button
          ref={triggerRef}
          id={id}
          name={name}
          type="button"
          className={`store-picker-trigger ${className}`}
          aria-label={`${ariaLabel}: ${value}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={id ? `${id}-options` : undefined}
          disabled={disabled}
          title={title || value}
          onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="store-picker-current">
            <span className="store-picker-dot" style={{ backgroundColor: getStoreColor(value) }} aria-hidden="true" />
            <span className="store-picker-value">{value}</span>
          </span>
          <span className="store-picker-chevron" aria-hidden="true">⌄</span>
        </button>
        {isOpen && (
          <div ref={popoverRef} className={`store-picker-popover ${openUpward ? 'open-upward' : ''}`} style={popoverMaxHeight ? { '--store-picker-max-height': `${popoverMaxHeight}px` } : undefined}>
            <div className="store-picker-heading">Choose a store</div>
            <div className="store-picker-options" role="listbox" id={id ? `${id}-options` : undefined} aria-label={ariaLabel}>
              {stores.map((store, index) => (
                <button
                  key={store}
                  ref={(node) => { optionRefs.current[index] = node; }}
                  type="button"
                  role="option"
                  aria-selected={store === value}
                  className={`store-picker-option ${store === value ? 'selected' : ''}`}
                  onClick={() => selectStore(store)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                >
                  <span className="store-picker-dot" style={{ backgroundColor: getStoreColor(store) }} aria-hidden="true" />
                  <span>{store}</span>
                  {store === value && <span className="store-picker-check" aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
            <div className="store-picker-divider" />
            <button type="button" className="store-picker-manage" onClick={openManageStores}>
              <span aria-hidden="true">＋</span> Manage stores
            </button>
          </div>
        )}
      </div>
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
