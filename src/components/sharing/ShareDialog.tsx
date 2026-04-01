import { useState, useEffect } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import Modal from '../ui/Modal';
import { useSharing } from '../../hooks/useSharing';
import type { HiveShare } from '../../lib/types';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  hiveId: string;
  hiveName: string;
}

export default function ShareDialog({ open, onClose, hiveId, hiveName }: ShareDialogProps) {
  const { shareHive, getSharesForHive, removeShare, loading } = useSharing();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shares, setShares] = useState<(HiveShare & { email: string })[]>([]);

  const loadShares = async () => {
    const data = await getSharesForHive(hiveId);
    setShares(data);
  };

  useEffect(() => {
    if (open) {
      loadShares();
      setEmail('');
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const result = await shareHive(hiveId, email.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(`Shared with ${email}`);
      setEmail('');
      loadShares();
    }
  };

  const handleRemove = async (shareId: string) => {
    await removeShare(shareId);
    loadShares();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Share "${hiveName}"`}>
      <form onSubmit={handleShare} className="flex gap-2 mb-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
          placeholder="Enter email address"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          <UserPlus size={16} /> Share
        </button>
      </form>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-3">{success}</p>}

      {shares.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Shared with</h4>
          <div className="space-y-2">
            {shares.map(share => (
              <div key={share.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{share.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{share.permission} access</p>
                </div>
                <button
                  onClick={() => handleRemove(share.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {shares.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Not shared with anyone yet. Enter an email above to share this hive.
        </p>
      )}
    </Modal>
  );
}
