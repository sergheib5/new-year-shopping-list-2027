import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Shopping List Collection
const SHOPPING_LIST_COLLECTION = 'shoppingList';
const MENU_COLLECTION = 'menu';
const STORES_COLLECTION = 'stores';

// Shopping List Functions
export const subscribeToShoppingList = (callback, onError) => {
  const q = query(collection(db, SHOPPING_LIST_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    },
    (error) => {
      console.error('Error subscribing to shopping list:', error);
      if (onError) {
        onError(error);
      }
    }
  );
};

export const addShoppingItem = async (item) => {
  return await addDoc(collection(db, SHOPPING_LIST_COLLECTION), {
    ...item,
    createdAt: new Date(),
    checked: false
  });
};

export const updateShoppingItem = async (id, updates) => {
  const itemRef = doc(db, SHOPPING_LIST_COLLECTION, id);
  return await updateDoc(itemRef, updates);
};

export const deleteShoppingItem = async (id) => {
  return await deleteDoc(doc(db, SHOPPING_LIST_COLLECTION, id));
};

export const toggleShoppingItem = async (id, checked) => {
  return await updateShoppingItem(id, { checked });
};

// Menu Functions
export const subscribeToMenu = (callback, onError) => {
  const q = query(collection(db, MENU_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    },
    (error) => {
      console.error('Error subscribing to menu:', error);
      if (onError) {
        onError(error);
      }
    }
  );
};

export const addMenuItem = async (item) => {
  try {
    // Ensure type is always included
    const menuItem = {
      ...item,
      type: item.type || 'daily',
      createdAt: new Date()
    };
    console.log('Adding menu item to Firestore:', menuItem);
    const docRef = await addDoc(collection(db, MENU_COLLECTION), menuItem);
    console.log('Menu item added with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id, updates) => {
  try {
    console.log('Updating menu item in Firestore:', { id, updates });
    const itemRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(itemRef, updates);
    console.log('Menu item updated successfully');
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id) => {
  try {
    console.log('Deleting menu item from Firestore:', id);
    await deleteDoc(doc(db, MENU_COLLECTION, id));
    console.log('Menu item deleted successfully');
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Shared Store Functions
export const subscribeToStores = (callback, onError) => {
  return onSnapshot(
    collection(db, STORES_COLLECTION),
    (snapshot) => {
      const stores = snapshot.docs.map(storeDoc => ({
        id: storeDoc.id,
        ...storeDoc.data()
      }));
      callback(stores);
    },
    (error) => {
      console.error('Error subscribing to stores:', error);
      if (onError) onError(error);
    }
  );
};

const normalizeStoreName = (name) => name.trim().replace(/\s+/g, ' ');
const getStoreDocumentId = (name) => normalizeStoreName(name).toLocaleLowerCase();

export const addCustomStore = async (rawName) => {
  const name = normalizeStoreName(rawName);
  if (!name || name.length > 40) {
    throw new Error('Store names must be between 1 and 40 characters.');
  }
  if (name.includes('/') || name === '.' || name === '..') {
    throw new Error('That store name can’t be used.');
  }

  const storeRef = doc(db, STORES_COLLECTION, getStoreDocumentId(name));
  await setDoc(storeRef, { name, createdAt: new Date() });

  return name;
};

export const deleteCustomStore = async (rawName) => {
  const name = normalizeStoreName(rawName);
  const storeRef = doc(db, STORES_COLLECTION, getStoreDocumentId(name));
  await deleteDoc(storeRef);
};

// Export Functions - Get all data for CSV export
export const getAllShoppingListItems = async () => {
  try {
    const q = query(collection(db, SHOPPING_LIST_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching shopping list items:', error);
    throw error;
  }
};

export const getAllMenuItems = async () => {
  try {
    const q = query(collection(db, MENU_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};
