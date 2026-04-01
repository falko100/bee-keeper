import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus, Share2, MapPin, Calendar, ClipboardList } from 'lucide-react';
import { useHives } from '../hooks/useHives';
import { useInspections } from '../hooks/useInspections';
import { formatDate, getHealthColor, getHealthLabel } from '../lib/utils';
import { generateShareToken } from '../lib/share';
import HiveForm from '../components/hives/HiveForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function HiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHive, updateHive, deleteHive } = useHives();
  const { getInspectionsForHive, deleteInspection } = useInspections();

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShareCopied, setShowShareCopied] = useState(false);
  const [deleteInspId, setDeleteInspId] = useState<string | null>(null);

  const hive = getHive(id!);
  if (!hive) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Hive not found.</p>
        <Link to="/hives" className="text-amber-600 hover:underline text-sm mt-2 inline-block">Back to Hives</Link>
      </div>
    );
  }

  const inspections = getInspectionsForHive(hive.id);

  const handleShare = () => {
    const token = generateShareToken(hive.id);
    updateHive(hive.id, { shareToken: token });
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setShowShareCopied(true);
    setTimeout(() => setShowShareCopied(false), 2000);
  };

  return (
    <div>
      <button onClick={() => navigate('/hives')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back to Hives
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{hive.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              {hive.location && (
                <span className="flex items-center gap-1"><MapPin size={14} /> {hive.location}</span>
              )}
              <span className="flex items-center gap-1"><Calendar size={14} /> Est. {formatDate(hive.dateEstablished)}</span>
              <Badge className="bg-amber-50 text-amber-700">{hive.type}</Badge>
            </div>
            {hive.notes && <p className="text-sm text-gray-600 mt-3">{hive.notes}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 relative" title="Share">
              <Share2 size={18} />
              {showShareCopied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
            <button onClick={() => setShowEdit(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700" title="Edit">
              <Edit2 size={18} />
            </button>
            <button onClick={() => setShowDelete(true)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600" title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {inspections.length > 0 && (
          <div className="flex items-center gap-4 mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getHealthColor(inspections[0].healthScore)}`}>
                {inspections[0].healthScore}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700">{getHealthLabel(inspections[0].healthScore)}</p>
                <p className="text-xs text-gray-500">Latest health score</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {inspections.length} inspection{inspections.length !== 1 ? 's' : ''} recorded
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Inspections</h2>
        <Link
          to={`/hives/${hive.id}/inspect`}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700"
        >
          <Plus size={18} /> New Inspection
        </Link>
      </div>

      {inspections.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="No inspections yet"
          description="Record your first inspection to start tracking this hive's health."
          action={
            <Link
              to={`/hives/${hive.id}/inspect`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700"
            >
              <Plus size={18} /> Record First Inspection
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {inspections.map(insp => (
            <div key={insp.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${getHealthColor(insp.healthScore)}`}>
                    {insp.healthScore}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(insp.date)}</p>
                    <p className="text-xs text-gray-500">
                      {insp.weather.condition} | {insp.weather.temperatureF}°F
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link to={`/hives/${hive.id}/inspect/${insp.id}`} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <Edit2 size={15} />
                  </Link>
                  <button onClick={() => setDeleteInspId(insp.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                <div><span className="text-gray-500">Queen:</span> <span className={insp.queenSpotted ? 'text-green-600' : 'text-red-500'}>{insp.queenSpotted ? 'Spotted' : 'Not seen'}</span></div>
                <div><span className="text-gray-500">Brood:</span> {insp.broodPattern}</div>
                <div><span className="text-gray-500">Temper:</span> {insp.temperament}</div>
                <div><span className="text-gray-500">Stores:</span> {insp.honeyStores}</div>
              </div>
              {insp.pestsAndDiseases.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {insp.pestsAndDiseases.map(p => (
                    <Badge key={p} className="bg-red-50 text-red-700">{p}</Badge>
                  ))}
                </div>
              )}
              {insp.notes && <p className="text-sm text-gray-600 mt-2">{insp.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <HiveForm
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={data => updateHive(hive.id, data)}
        hive={hive}
      />
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => { deleteHive(hive.id); navigate('/hives'); }}
        title="Delete Hive"
        message={`Are you sure you want to delete "${hive.name}"? All inspections and tasks for this hive will also be deleted.`}
        confirmLabel="Delete"
        variant="danger"
      />
      <ConfirmDialog
        open={!!deleteInspId}
        onClose={() => setDeleteInspId(null)}
        onConfirm={() => { if (deleteInspId) deleteInspection(deleteInspId); }}
        title="Delete Inspection"
        message="Are you sure you want to delete this inspection record?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
