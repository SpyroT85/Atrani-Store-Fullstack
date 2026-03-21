import { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiMail, FiX, FiUser, FiMoreVertical, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import FilterDropdown from '../ui/FilterDropdown';
import SearchInput from '../ui/SearchInput';
import Pagination from '../ui/Pagination';

const API_URL = 'https://api.spyros-tserkezos.dev';

interface Admin {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

const ROLE_STYLES: Record<string, string> = {
  superadmin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  admin: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  demo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

const ROLE_ICON_STYLES: Record<string, string> = {
  superadmin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  admin: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  demo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  demo: 'Demo',
};

const MOCK_ADMINS: Admin[] = [
  { id: 1, email: 'spyros@atrani.com', role: 'superadmin', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, email: 'maria@atrani.com', role: 'admin', created_at: '2024-02-20T09:30:00Z' },
  { id: 3, email: 'nikos@atrani.com', role: 'admin', created_at: '2024-03-05T14:00:00Z' },
  { id: 4, email: 'demo1@atrani.com', role: 'demo', created_at: '2024-03-10T11:00:00Z' },
  { id: 5, email: 'demo2@atrani.com', role: 'demo', created_at: '2024-03-12T16:00:00Z' },
  { id: 6, email: 'demo3@atrani.com', role: 'demo', created_at: '2024-03-14T08:00:00Z' },
  { id: 7, email: 'demo@atrani-adminpanel.com', role: 'demo', created_at: '2024-03-20T23:00:00Z' },
  { id: 8, email: 'admin4@atrani.com', role: 'admin', created_at: '2024-03-21T10:00:00Z' },
  { id: 9, email: 'admin5@atrani.com', role: 'admin', created_at: '2024-03-22T10:00:00Z' },
  { id: 10, email: 'admin6@atrani.com', role: 'admin', created_at: '2024-03-23T10:00:00Z' },
  { id: 11, email: 'admin7@atrani.com', role: 'admin', created_at: '2024-03-24T10:00:00Z' },
  { id: 12, email: 'admin8@atrani.com', role: 'admin', created_at: '2024-03-25T10:00:00Z' },
  { id: 13, email: 'admin9@atrani.com', role: 'admin', created_at: '2024-03-26T10:00:00Z' },
  { id: 14, email: 'admin10@atrani.com', role: 'admin', created_at: '2024-03-27T10:00:00Z' },
  { id: 15, email: 'demo4@atrani.com', role: 'demo', created_at: '2024-03-28T10:00:00Z' },
  { id: 16, email: 'demo5@atrani.com', role: 'demo', created_at: '2024-03-29T10:00:00Z' },
  { id: 17, email: 'demo6@atrani.com', role: 'demo', created_at: '2024-03-30T10:00:00Z' },
  { id: 18, email: 'demo7@atrani.com', role: 'demo', created_at: '2024-03-31T10:00:00Z' },
  { id: 19, email: 'demo8@atrani.com', role: 'demo', created_at: '2024-04-01T10:00:00Z' },
  { id: 20, email: 'demo9@atrani.com', role: 'demo', created_at: '2024-04-02T10:00:00Z' },
  { id: 21, email: 'admin11@atrani.com', role: 'admin', created_at: '2024-04-03T10:00:00Z' },
  { id: 22, email: 'admin12@atrani.com', role: 'admin', created_at: '2024-04-04T10:00:00Z' },
  { id: 23, email: 'admin13@atrani.com', role: 'admin', created_at: '2024-04-05T10:00:00Z' },
  { id: 24, email: 'admin14@atrani.com', role: 'admin', created_at: '2024-04-06T10:00:00Z' },
  { id: 25, email: 'admin15@atrani.com', role: 'admin', created_at: '2024-04-07T10:00:00Z' },
  { id: 26, email: 'demo10@atrani.com', role: 'demo', created_at: '2024-04-08T10:00:00Z' },
  { id: 27, email: 'demo11@atrani.com', role: 'demo', created_at: '2024-04-09T10:00:00Z' },
  { id: 28, email: 'demo12@atrani.com', role: 'demo', created_at: '2024-04-10T10:00:00Z' },
  { id: 29, email: 'demo13@atrani.com', role: 'demo', created_at: '2024-04-11T10:00:00Z' },
  { id: 30, email: 'admin16@atrani.com', role: 'admin', created_at: '2024-04-12T10:00:00Z' },
  { id: 31, email: 'admin17@atrani.com', role: 'admin', created_at: '2024-04-13T10:00:00Z' },
  { id: 32, email: 'demo14@atrani.com', role: 'demo', created_at: '2024-04-14T10:00:00Z' },
];

function AccountMenu({ account, currentAdmin, onDelete, onRoleChange, onInvite }: {
  account: Admin;
  currentAdmin: { id: number; role: string; email: string; token: string } | null;
  onDelete: () => void;
  onRoleChange: (role: string) => void;
  onInvite: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isSuperAdmin = currentAdmin?.role === 'superadmin';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <FiMoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
          {!editOpen ? (
            <>
              {isSuperAdmin ? (
                <>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <FiEdit2 size={14} />
                    Change Role
                  </button>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                  <button
                    onClick={() => { onDelete(); setOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onInvite(); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <FiMail size={14} />
                  Invite
                </button>
              )}
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-xs font-medium text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                Select role
              </div>
              {['superadmin', 'admin', 'demo'].map(role => (
                <button
                  key={role}
                  onClick={() => { onRoleChange(role); setOpen(false); setEditOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                    account.role === role ? 'font-semibold text-[#C8874A]' : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {ROLE_LABELS[role]}
                  {account.role === role && <span className="ml-auto text-[#C8874A]">✓</span>}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Accounts() {
  const { admin } = useAuth();
  const isDemo = admin?.role === 'demo';
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('admin'); // default value matches FilterDropdown options
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = a.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const totalPages = Math.ceil(filteredAdmins.length / pageSize);
  const paginatedAdmins = filteredAdmins.slice((page - 1) * pageSize, page * pageSize);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${admin?.token}`,
  };

  useEffect(() => {
    if (isDemo) {
      setAdmins(MOCK_ADMINS);
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/admins`, { headers })
      .then(r => {
        if (!r.ok) { setLoading(false); return; }
        return r.json();
      })
      .then(data => {
        if (data) setAdmins(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this account?')) return;
    await fetch(`${API_URL}/api/admins/${id}`, { method: 'DELETE', headers });
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const handleRoleChange = async (id: number, role: string) => {
    const res = await fetch(`${API_URL}/api/admins/${id}/role`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role }),
    });
    const updated = await res.json();
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, role: updated.role } : a));
  };

  const handleInvite = async () => {
    if (!inviteEmail) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/api/admins/invite`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
      setInviteEmail('');
      setInviteRole('admin');
      setTimeout(() => { setInviteOpen(false); setSuccess(false); }, 2000);
    } catch {
      setError('Failed to send invite');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition";

  return (
    <div>
      {isDemo && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
          <span className="text-amber-500">⚠️</span>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Demo mode — account management is disabled.
          </p>
        </div>
      )}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-visible">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-sm font-medium">Accounts ({filteredAdmins.length})</span>
          <FilterDropdown
            value={roleFilter}
            onChange={setRoleFilter}
            allLabel="All Roles"
            options={[
              { value: 'superadmin', label: 'Super Admin' },
              { value: 'admin', label: 'Admin' },
              { value: 'demo', label: 'Demo' },
            ]}
          />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by email..."
          />
          <div className="ml-auto">
            <Button variant="primary" icon={<FiMail size={13} />} onClick={isDemo ? undefined : () => setInviteOpen(true)} disabled={isDemo}>
              Invite
            </Button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Email</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Role</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Created</th>
              <th className="px-5 py-3 text-center text-xs font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-zinc-400">Loading...</td></tr>
            ) : paginatedAdmins.map(a => (
              <tr key={a.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${ROLE_ICON_STYLES[a.role]}`}>
                      <FiUser size={16} />
                    </span>
                    <span className="font-medium">{a.email}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_STYLES[a.role]}`}>
                    {ROLE_LABELS[a.role]}
                  </span>
                </td>
                <td className="px-5 py-3 text-zinc-400 text-xs">
                  {new Date(a.created_at).toLocaleDateString('el-GR')}
                </td>
                <td className="px-5 py-3 text-center">
                  {a.id !== admin?.id && !isDemo && (
                    <AccountMenu
                      account={a}
                      currentAdmin={admin}
                      onDelete={() => handleDelete(a.id)}
                      onRoleChange={(role) => handleRoleChange(a.id, role)}
                      onInvite={() => { setInviteEmail(a.email); setInviteOpen(true); }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredAdmins.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setInviteOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-medium">Send Invite</h2>
              <button onClick={() => setInviteOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500">Email</label>
                <input className={inputClass} type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="admin@atrani.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500">Role</label>
                <select
                  className={inputClass}
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="demo">Demo</option>
                </select>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && <p className="text-xs text-green-500">Invite sent successfully!</p>}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button variant="edit" onClick={() => { setInviteOpen(false); setSuccess(false); setError(''); }}>Cancel</Button>
                <Button variant="primary" onClick={handleInvite}>{saving ? 'Sending...' : 'Send Invite'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}