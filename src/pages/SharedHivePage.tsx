import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { decodeShareToken } from '../lib/share';
import { useHives } from '../hooks/useHives';
import { useInspections } from '../hooks/useInspections';
import { formatDate, getHealthColor } from '../lib/utils';
import Badge from '../components/ui/Badge';

export default function SharedHivePage() {
  const { token } = useParams<{ token: string }>();
  const decoded = token ? decodeShareToken(token) : null;
  const { getHive } = useHives();
  const { getInspectionsForHive } = useInspections();

  if (!decoded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">Invalid share link</p>
          <Link to="/" className="text-amber-600 hover:underline text-sm">Go to BeeKeeper</Link>
        </div>
      </div>
    );
  }

  const hive = getHive(decoded.hiveId);
  if (!hive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">Hive not found</p>
          <p className="text-sm text-gray-500 mb-4">This share link may only work in the browser where the hive was created.</p>
          <Link to="/" className="text-amber-600 hover:underline text-sm">Go to BeeKeeper</Link>
        </div>
      </div>
    );
  }

  const inspections = getInspectionsForHive(hive.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🐝</span>
          <span className="text-sm font-medium text-gray-500">BeeKeeper Shared Hive</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{hive.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
            {hive.location && <span className="flex items-center gap-1"><MapPin size={14} /> {hive.location}</span>}
            <span className="flex items-center gap-1"><Calendar size={14} /> Est. {formatDate(hive.dateEstablished)}</span>
            <Badge className="bg-amber-50 text-amber-700">{hive.type}</Badge>
          </div>
          {hive.notes && <p className="text-sm text-gray-600 mt-3">{hive.notes}</p>}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspection History ({inspections.length})</h2>

        {inspections.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">No inspections recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {inspections.map(insp => (
              <div key={insp.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${getHealthColor(insp.healthScore)}`}>
                    {insp.healthScore}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(insp.date)}</p>
                    <p className="text-xs text-gray-500">{insp.weather.condition} | {insp.weather.temperatureF}°F</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div><span className="text-gray-500">Queen:</span> {insp.queenSpotted ? 'Yes' : 'No'}</div>
                  <div><span className="text-gray-500">Brood:</span> {insp.broodPattern}</div>
                  <div><span className="text-gray-500">Temper:</span> {insp.temperament}</div>
                  <div><span className="text-gray-500">Stores:</span> {insp.honeyStores}</div>
                </div>
                {insp.notes && <p className="text-sm text-gray-600 mt-2">{insp.notes}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-amber-600 hover:underline text-sm">
            <ExternalLink size={14} /> Open BeeKeeper
          </Link>
        </div>
      </div>
    </div>
  );
}
