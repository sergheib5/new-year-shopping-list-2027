import { useEffect, useRef } from 'react';
import './ConfirmDeleteDialog.css';

const ConfirmDeleteDialog = ({ title, description, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
    } else if (!dialog.open) {
      dialog.setAttribute('open', '');
    }

    return () => {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-delete-dialog"
      role="alertdialog"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="confirm-delete-icon" aria-hidden="true">🗑️</div>
      <h2 id="confirm-delete-title">{title}</h2>
      <p id="confirm-delete-description">{description}</p>
      <div className="confirm-delete-actions">
        <button type="button" className="confirm-delete-cancel" autoFocus onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="confirm-delete-submit" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDeleteDialog;
