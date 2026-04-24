import { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal/Modal';
import type { PantryItem } from './pantry.types';
import './PantryModal.scss';

interface PantryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PantryItem) => void;
  item?: PantryItem;
}

const commonUnits = ['pcs', 'kg', 'l', 'g', 'ml', 'cup', 'tbsp', 'tsp'];

export function PantryModal({ isOpen, onClose, onSave, item }: PantryModalProps) {
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [unit, setUnit] = useState(item?.unit || 'pcs');

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '');
      setQuantity(item?.quantity || 1);
      setUnit(item?.unit || 'pcs');
    }

  }, [isOpen]); 

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
      <h3 className="pantry-form__title">{item ? 'Edit Ingredient' : 'Add Ingredient'}</h3>
      <div className="pantry-form__field">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., eggs, flour, milk"
        />
      </div>
      <div className="pantry-form__field">
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="0"
          step="0.1"
        />
      </div>
      <div className="pantry-form__field">
        <label>Unit:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          {commonUnits.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="pantry-form__actions">
        <button className="pantry-form__btn pantry-form__btn--cancel" onClick={onClose}>Cancel</button>
        <button className="pantry-form__btn pantry-form__btn--save" onClick={handleSave} disabled={!name.trim()}>
          {item ? 'Update' : 'Add'}
        </button>
      </div>
    </Modal>
  );
}