import { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal/Modal';
import type { PantryItem } from './pantry.types';

interface PantryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PantryItem) => void;
  item?: PantryItem;
}

const commonUnits = ['st', 'kg', 'l', 'g', 'ml', 'cup', 'tbsp', 'tsp'];

export function PantryModal({ isOpen, onClose, onSave, item }: PantryModalProps) {
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [unit, setUnit] = useState(item?.unit || 'st');

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '');
      setQuantity(item?.quantity || 1);
      setUnit(item?.unit || 'st');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only depend on isOpen to avoid cascading renders

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...item,
      name: name.trim(),
      quantity,
      unit,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>{item ? 'Edit Ingredient' : 'Add Ingredient'}</h3>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., eggs, flour, milk"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            step="0.1"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Unit:
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            {commonUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()}>
          {item ? 'Update' : 'Add'}
        </button>
      </div>
    </Modal>
  );
}