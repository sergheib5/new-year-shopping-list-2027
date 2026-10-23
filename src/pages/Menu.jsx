import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import MenuItemForm from '../components/MenuItemForm';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { 
  subscribeToMenu, 
  addMenuItem,
  updateMenuItem,
  deleteMenuItem 
} from '../firebase/db';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('daily'); // 'daily', 'salad', 'snack', 'drink'

  useEffect(() => {
    const unsubscribe = subscribeToMenu((items) => {
      setMenuItems(items);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async (itemData, itemId) => {
    try {
      console.log('Menu handleAddItem:', { itemData, itemId });
      
      if (itemId) {
        console.log('Updating menu item:', itemId);
        await updateMenuItem(itemId, itemData);
      } else {
        console.log('Adding new menu item');
        await addMenuItem(itemData);
      }
      
      setShowForm(false);
      setEditingItem(null);
      setFormType('daily');
    } catch (error) {
      console.error('Error saving menu item:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        itemData,
        itemId
      });
      alert(`Failed to save item: ${error.message || 'Please try again.'}`);
    }
  };

  const handleDeleteItem = (id) => {
    const item = menuItems.find((entry) => entry.id === id);
    setPendingDelete(item || { id, name: 'this item' });
  };

  const confirmDeleteItem = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMenuItem(pendingDelete.id);
      setPendingDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setPendingDelete(null);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormType(item.type || 'daily');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormType('daily');
  };

  const handleAddNew = (type) => {
    setFormType(type);
    setEditingItem(null);
    setShowForm(true);
  };

  // Group items by type
  const dailyMenuItems = menuItems.filter(item => item.type === 'daily');
  const saladItems = menuItems.filter(item => item.type === 'salad');
  const snackItems = menuItems.filter(item => item.type === 'snack');
  const drinkItems = menuItems.filter(item => item.type === 'drink');
  const libraryCount = saladItems.length + snackItems.length + drinkItems.length;

  const renderMenuItemAction = (item, label = 'menu item') => (
    <button
      className="cancel-button"
      onClick={() => handleDeleteItem(item.id)}
      aria-label={`Delete ${item.name || item.date || label}`}
      title="Delete"
    >
      ×
    </button>
  );

  return (
    <div className="menu-page">
      <Header />
      <main className="main-content">
        <div className="menu-container">
          <div className="menu-intro">
            <div>
              <p className="menu-eyebrow">PLAN TOGETHER</p>
              <h1>Menu planner</h1>
              <p className="menu-subtitle">Plan what you’ll eat and keep everyone’s meal ideas in one place.</p>
            </div>
            <div className="menu-summary" aria-label={`${dailyMenuItems.length} planned days and ${libraryCount} saved ideas`}>
              <span><strong>{dailyMenuItems.length}</strong> planned {dailyMenuItems.length === 1 ? 'day' : 'days'}</span>
              <i aria-hidden="true" />
              <span><strong>{libraryCount}</strong> saved ideas</span>
            </div>
          </div>

          <section className="menu-section daily-section">
            <div className="section-header">
              <div><p className="section-kicker">YOUR SCHEDULE</p><h2><span aria-hidden="true">▦</span> Daily plan</h2></div>
              <button className="add-section-button primary" onClick={() => handleAddNew('daily')}>＋ <span>Add a day</span></button>
            </div>
            {dailyMenuItems.length === 0 ? (
              <div className="menu-empty-state">
                <div className="menu-empty-icon" aria-hidden="true">▤</div>
                <div><h3>Your plan starts here</h3><p>Add a date, then jot down lunch and dinner. You can change it anytime.</p></div>
                <button className="text-action" onClick={() => handleAddNew('daily')}>Plan the first day <span aria-hidden="true">→</span></button>
              </div>
            ) : (
              <div className="day-list">
                {dailyMenuItems.map((item) => (
                  <article key={item.id} className="day-card">
                    <button className="day-card-edit" onClick={() => handleEditItem(item)} aria-label={`Edit menu for ${item.date || 'this date'}`}>
                      <span className="day-date">{item.date || 'Date not set'}</span>
                      <span className="day-meals">
                        <span><small>Lunch</small><strong>{item.lunch || <em>Not planned</em>}</strong></span>
                        <span><small>Dinner</small><strong>{item.dinner || <em>Not planned</em>}</strong></span>
                      </span>
                      <span className="edit-hint">Edit day</span>
                    </button>
                    {renderMenuItemAction(item)}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="menu-section library-section">
            <div className="section-header">
              <div><p className="section-kicker">IDEAS FOR THE TABLE</p><h2><span aria-hidden="true">◉</span> Meal ideas</h2></div>
              <button className="add-section-button" onClick={() => handleAddNew('salad')}>＋ <span>Add a meal</span></button>
            </div>
            <p className="section-description">Save dishes and who’s making them, then use these ideas when planning a day.</p>
            {saladItems.length === 0 ? (
              <div className="compact-empty"><span aria-hidden="true">＋</span><div><strong>No meal ideas yet</strong><p>Add a favorite dish to make planning faster.</p></div><button className="text-action" onClick={() => handleAddNew('salad')}>Add meal</button></div>
            ) : (
              <div className="idea-grid">
                {saladItems.map((item) => (
                  <article className="idea-card" key={item.id}>
                    <button className="idea-edit" onClick={() => handleEditItem(item)}><strong>{item.name || 'Untitled meal'}</strong><span>{item.preparedBy ? `Made by ${item.preparedBy}` : 'No cook assigned'}</span></button>
                    {renderMenuItemAction(item, 'meal')}
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="extras-grid">
            {[
              { title: 'Snacks', type: 'snack', items: snackItems, icon: '◌', empty: 'Easy bites and treats' },
              { title: 'Drinks', type: 'drink', items: drinkItems, icon: '◍', empty: 'Something to sip' },
            ].map(({ title, type, items, icon, empty }) => (
              <section className="menu-section extra-section" key={type}>
                <div className="section-header">
                  <div><p className="section-kicker">EXTRAS</p><h2><span aria-hidden="true">{icon}</span> {title}</h2></div>
                  <button className="add-section-button" onClick={() => handleAddNew(type)}>＋ <span>Add</span></button>
                </div>
                {items.length === 0 ? (
                  <div className="extra-empty"><span>{empty}</span><button onClick={() => handleAddNew(type)}>Add {title.toLowerCase()} <span aria-hidden="true">→</span></button></div>
                ) : (
                  <div className="extra-list">
                    {items.map((item) => <article className="extra-item" key={item.id}><button onClick={() => handleEditItem(item)}>{item.name || `Untitled ${type}`}</button>{renderMenuItemAction(item, type)}</article>)}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {showForm && (
          <MenuItemForm
            item={editingItem}
            type={formType}
            onSave={handleAddItem}
            onCancel={handleCloseForm}
          />
        )}
      {pendingDelete && (
        <ConfirmDeleteDialog
          title="Delete menu item?"
          description={`“${pendingDelete.name || pendingDelete.lunch || pendingDelete.dinner || 'This item'}” will be removed from your menu. This can’t be undone.`}
          onConfirm={confirmDeleteItem}
          onCancel={() => setPendingDelete(null)}
        />
      )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Menu;

