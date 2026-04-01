import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { Hive } from '../../lib/types';
import { useInspections } from '../../hooks/useInspections';
import { formatDate, getHealthColor } from '../../lib/utils';
import Badge from '../ui/Badge';

interface HiveCardProps {
  hive: Hive;
}

export default function HiveCard({ hive }: HiveCardProps) {
  const navigate = useNavigate();
  const { getLatestInspection } = useInspections();
  const latest = getLatestInspection(hive.id);

  return (
    <div
      onClick={() => navigate(`/hives/${hive.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{hive.name}</h3>
          {hive.location && (
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin size={14} /> {hive.location}
            </p>
          )}
        </div>
        <Badge className="bg-amber-50 text-amber-700">{hive.type}</Badge>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <Calendar size={12} />
        Est. {formatDate(hive.dateEstablished)}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {latest ? (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${getHealthColor(latest.healthScore)}`}>
              {latest.healthScore}
            </span>
            <span className="text-xs text-gray-500">Last: {formatDate(latest.date)}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No inspections yet</span>
        )}
        <ArrowRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
