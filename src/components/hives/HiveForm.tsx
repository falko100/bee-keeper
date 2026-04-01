import { useState, useEffect } from 'react';
import type { Hive, HiveType } from '../../lib/types';
import { HIVE_TYPES } from '../../lib/constants';
import { toISODateString } from '../../lib/utils';
import Modal from '../ui/Modal';

interface HiveFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; location: string; type: HiveType; dateEstablished: string; notes: string }) => void;
  hive?: Hive | null;
}

export default function HiveForm({ open, onClose, onSubmit, hive }: HiveFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<HiveType>('Spaarkast');
  const [dateEstablished, setDateEstablished] = useState(toISODateString());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (hive) {
      setName(hive.name);
      setLocation(hive.location);
      setType(hive.type);
      setDateEstablished(hive.dateEstablished);
      setNotes(hive.notes);
    } else {
      setName('');
      setLocation('');
      setType('Langstroth');
      setDateEstablished(toISODateString());
      setNotes('');
    }
  }, [hive, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), location: location.trim(), type, dateEstablished, notes: notes.trim() });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={hive ? 'Edit Hive' : 'Add New Hive'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hive Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            placeholder="e.g., Sunny Meadow Hive"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            placeholder="e.g., Back garden, north corner"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hive Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as HiveType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {HIVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Established</label>
            <input
              type="date"
              value={dateEstablished}
              onChange={e => setDateEstablished(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
            placeholder="Any additional notes about this hive..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">
            {hive ? 'Save Changes' : 'Add Hive'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
