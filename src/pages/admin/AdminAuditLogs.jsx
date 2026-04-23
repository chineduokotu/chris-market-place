import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminTable from '../../components/admin/AdminTable';
import { EmptyState, Input, Select } from '../../components/ui';

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AdminAuditLogs() {
  const [action, setAction] = useState('');
  const [targetType, setTargetType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-audit-logs', action, targetType, dateFrom, dateTo, page],
    queryFn: () => adminApi.listAuditLogs({
      action,
      target_type: targetType,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: 25,
      page,
    }),
  });

  const rows = data?.data ?? [];

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <AdminFilters className="md:grid-cols-[1.2fr_1fr_180px_180px_auto]">
        <Input value={action} onChange={(event) => { setAction(event.target.value); setPage(1); }} placeholder="Filter by action name" />
        <Select value={targetType} onChange={(event) => { setTargetType(event.target.value); setPage(1); }}>
          <option value="">All target types</option>
          <option value="users">Users</option>
          <option value="services">Services</option>
          <option value="categories">Categories</option>
          <option value="bookings">Bookings</option>
          <option value="reviews">Reviews</option>
        </Select>
        <Input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} />
        <Input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} />
        <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
          {data?.total ?? 0} log entries
        </div>
      </AdminFilters>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No audit log entries" description="Admin actions will appear here automatically as the team uses the panel." />
      ) : (
        <AdminTable
          columns={[
            { key: 'action', label: 'Action' },
            { key: 'admin', label: 'Admin' },
            { key: 'target', label: 'Target' },
            { key: 'reason', label: 'Reason' },
            { key: 'when', label: 'When' },
          ]}
          isLoading={isLoading}
        >
          {rows.map((entry) => (
            <tr key={entry.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-bold text-slate-900">{entry.action}</p>
                <p className="text-sm text-slate-500">{entry.target_type} #{entry.target_id}</p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">{entry.admin?.name || 'Unknown admin'}</p>
                <p className="text-sm text-slate-500">{entry.admin?.email}</p>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{entry.target_type}</td>
              <td className="px-5 py-4 text-sm text-slate-500">
                {entry.reason || (entry.metadata ? JSON.stringify(entry.metadata) : 'No reason provided')}
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-600">{formatDateTime(entry.created_at)}</td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminPagination
        currentPage={data?.current_page}
        lastPage={data?.last_page}
        from={data?.from}
        to={data?.to}
        total={data?.total}
        onPageChange={setPage}
      />
    </div>
  );
}
