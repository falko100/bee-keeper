import { useState } from 'react';
import { Plus, Warehouse } from 'lucide-react';
import { useHives } from '../hooks/useHives';
import HiveCard from '../components/hives/HiveCard';
import HiveForm from '../components/hives/HiveForm';
import EmptyState from '../components/ui/EmptyState';

export default function HivesPage() {
  const { hives, addHive } = useHives();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Hives</h1>
          <p className="text-sm text-gray-500 mt-1">{hives.length} hive{hives.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={18} /> Add Hive
        </button>
      </div>

      {hives.length === 0 ? (
        <EmptyState
          icon={<Warehouse size={48} />}
          title="No hives yet"
          description="Add your first hive to start tracking inspections and managing your apiary."
          action={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700"
            >
              <Plus size={18} /> Add Your First Hive
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hives.map(hive => (
            <HiveCard key={hive.id} hive={hive} />
          ))}
        </div>
      )}

      <HiveForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={addHive}
      />
    </div>
  );
}
