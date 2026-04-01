import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHives } from '../hooks/useHives';
import { useInspections } from '../hooks/useInspections';
import type { BroodPattern, Temperament, HoneyStores, WeatherCondition } from '../lib/types';
import { BROOD_PATTERNS, TEMPERAMENTS, HONEY_STORES, WEATHER_CONDITIONS, COMMON_PESTS } from '../lib/constants';
import { toISODateString } from '../lib/utils';
import { calculateHealthScore } from '../lib/health-score';
import { getHealthColor } from '../lib/utils';

export default function InspectionFormPage() {
  const { id: hiveId, inspId } = useParams<{ id: string; inspId?: string }>();
  const navigate = useNavigate();
  const { getHive } = useHives();
  const { inspections, addInspection, updateInspection } = useInspections();

  const hive = getHive(hiveId!);
  const existing = inspId ? inspections.find(i => i.id === inspId) : null;

  const [date, setDate] = useState(toISODateString());
  const [queenSpotted, setQueenSpotted] = useState(false);
  const [broodPattern, setBroodPattern] = useState<BroodPattern>('Good');
  const [temperament, setTemperament] = useState<Temperament>('Calm');
  const [honeyStores, setHoneyStores] = useState<HoneyStores>('Adequate');
  const [selectedPests, setSelectedPests] = useState<string[]>([]);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('Sunny');
  const [temperatureC, setTemperatureC] = useState(20);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setDate(existing.date);
      setQueenSpotted(existing.queenSpotted);
      setBroodPattern(existing.broodPattern);
      setTemperament(existing.temperament);
      setHoneyStores(existing.honeyStores);
      setSelectedPests(existing.pestsAndDiseases);
      setWeatherCondition(existing.weather.condition);
      setTemperatureC(existing.weather.temperatureC);
      setNotes(existing.notes);
    }
  }, [existing]);

  if (!hive) {
    return <div className="text-center py-20 text-gray-500">Hive not found.</div>;
  }

  const previewScore = calculateHealthScore({
    queenSpotted,
    broodPattern,
    temperament,
    honeyStores,
    pestsAndDiseases: selectedPests,
  });

  const togglePest = (pest: string) => {
    setSelectedPests(prev =>
      prev.includes(pest) ? prev.filter(p => p !== pest) : [...prev, pest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      hiveId: hive.id,
      date,
      queenSpotted,
      broodPattern,
      temperament,
      honeyStores,
      pestsAndDiseases: selectedPests,
      weather: { condition: weatherCondition, temperatureC },
      notes: notes.trim(),
    };
    if (existing) {
      await updateInspection(existing.id, data);
    } else {
      await addInspection(data);
    }
    navigate(`/hives/${hive.id}`);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none";

  return (
    <div>
      <button onClick={() => navigate(`/hives/${hive.id}`)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back to {hive.name}
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{existing ? 'Edit' : 'New'} Inspection</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Health Score:</span>
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getHealthColor(previewScore)}`}>
            {previewScore}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Date & Weather</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Weather</label>
              <select value={weatherCondition} onChange={e => setWeatherCondition(e.target.value as WeatherCondition)} className={inputClass}>
                {WEATHER_CONDITIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Temperature (°C)</label>
              <input type="number" value={temperatureC} onChange={e => setTemperatureC(Number(e.target.value))} className={inputClass} min={-30} max={50} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Queen & Brood</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Queen Spotted?</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={queenSpotted} onChange={() => setQueenSpotted(true)} className="text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!queenSpotted} onChange={() => setQueenSpotted(false)} className="text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className={labelClass}>Brood Pattern</label>
              <select value={broodPattern} onChange={e => setBroodPattern(e.target.value as BroodPattern)} className={inputClass}>
                {BROOD_PATTERNS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Colony Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Temperament</label>
              <select value={temperament} onChange={e => setTemperament(e.target.value as Temperament)} className={inputClass}>
                {TEMPERAMENTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Honey Stores</label>
              <select value={honeyStores} onChange={e => setHoneyStores(e.target.value as HoneyStores)} className={inputClass}>
                {HONEY_STORES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Pests & Diseases</h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_PESTS.map(pest => (
              <button
                key={pest}
                type="button"
                onClick={() => togglePest(pest)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedPests.includes(pest)
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {pest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Additional observations, actions taken, etc."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(`/hives/${hive.id}`)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50">
            {saving ? 'Saving...' : existing ? 'Update' : 'Save'} Inspection
          </button>
        </div>
      </form>
    </div>
  );
}
