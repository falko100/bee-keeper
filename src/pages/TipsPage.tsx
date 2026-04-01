import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { SEASONAL_TIPS } from '../lib/tips-data';
import { MONTHS, TIP_CATEGORIES } from '../lib/constants';
import Badge from '../components/ui/Badge';

export default function TipsPage() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const tips = SEASONAL_TIPS.filter(t => t.month === selectedMonth);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seasonal Tips</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly beekeeping guidance and reminders</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {MONTHS.map((month, idx) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(idx + 1)}
            className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedMonth === idx + 1
                ? 'bg-amber-600 text-white'
                : idx + 1 === currentMonth
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {month.slice(0, 3)}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-amber-500" />
        {MONTHS[selectedMonth - 1]} Tips
        {selectedMonth === currentMonth && (
          <Badge className="bg-amber-100 text-amber-700">Current Month</Badge>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map(tip => {
          const cat = TIP_CATEGORIES.find(c => c.value === tip.category);
          return (
            <div key={tip.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                {cat && <Badge className={cat.color}>{cat.label}</Badge>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
