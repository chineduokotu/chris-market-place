import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, MessageSquareMore } from 'lucide-react';
import { adminApi } from '../../api/admin';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminDetailPanel from '../../components/admin/AdminDetailPanel';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminTable from '../../components/admin/AdminTable';
import { Button, Card, CardBody, CardHeader, EmptyState, Input, Select, Skeleton, Textarea } from '../../components/ui';

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-bookings', deferredSearch, status, page],
    queryFn: () => adminApi.listBookings({ q: deferredSearch, status, per_page: 20, page }),
  });

  const { data: bookingDetail, isLoading: isBookingDetailLoading } = useQuery({
    queryKey: ['admin-booking', selectedBookingId],
    queryFn: () => adminApi.getBooking(selectedBookingId),
    enabled: Boolean(selectedBookingId),
  });

  const mutation = useMutation({
    mutationFn: ({ bookingId, note }) => adminApi.updateBookingNote(bookingId, {
      admin_note: note,
      reason: 'Admin note updated from admin panel',
    }),
    onSuccess: () => {
      setEditingBooking(null);
      setAdminNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });

  const rows = data?.data ?? [];

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <AdminFilters className="md:grid-cols-[minmax(0,1.5fr)_180px_auto]">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search booking by service, seeker, provider"
        />
        <Select value={status} onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </Select>
        <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
          {data?.total ?? 0} bookings
        </div>
      </AdminFilters>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No bookings found" description="Bookings will appear here once providers and seekers start matching." />
      ) : (
        <AdminTable
          columns={[
            { key: 'service', label: 'Service' },
            { key: 'people', label: 'People' },
            { key: 'status', label: 'Status' },
            { key: 'adminNote', label: 'Admin Note' },
            { key: 'actions', label: 'Actions' },
          ]}
          isLoading={isLoading}
        >
          {rows.map((booking) => (
            <tr key={booking.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-bold text-slate-900">{booking.service?.title || `Booking #${booking.id}`}</p>
                <p className="text-sm text-slate-500">Created {new Date(booking.created_at).toLocaleDateString()}</p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">Seeker: {booking.seeker?.name || 'Unknown'}</p>
                <p className="text-sm text-slate-500">Provider: {booking.provider?.name || 'Unknown'}</p>
              </td>
              <td className="px-5 py-4"><AdminStatusBadge status={booking.status} /></td>
              <td className="px-5 py-4 text-sm text-slate-500">{booking.admin_note || 'No note'}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedBookingId(booking.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingBooking(booking);
                      setAdminNote(booking.admin_note || '');
                    }}
                  >
                    <MessageSquareMore size={14} />
                    Edit note
                  </Button>
                </div>
              </td>
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

      <AdminConfirmDialog
        open={Boolean(editingBooking)}
        title="Update booking note"
        description={editingBooking ? `Internal note for ${editingBooking.service?.title || `booking #${editingBooking.id}`}.` : ''}
        confirmLabel="Save note"
        loading={mutation.isPending}
        onCancel={() => {
          setEditingBooking(null);
          setAdminNote('');
        }}
        onConfirm={() => mutation.mutate({ bookingId: editingBooking.id, note: adminNote })}
      >
        <Textarea
          rows={5}
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          placeholder="Add private context for support, moderation, or follow-up"
        />
      </AdminConfirmDialog>

      <AdminDetailPanel
        open={Boolean(selectedBookingId)}
        title={bookingDetail?.service?.title || 'Booking details'}
        subtitle={bookingDetail ? `Booking #${bookingDetail.id}` : ''}
        onClose={() => setSelectedBookingId(null)}
      >
        {isBookingDetailLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-[24px]" />)}
          </div>
        ) : bookingDetail ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Booking</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Status</span><AdminStatusBadge status={bookingDetail.status} /></div>
                  <div className="flex items-center gap-2"><CalendarClock size={14} className="text-slate-400" /><span>{new Date(bookingDetail.created_at).toLocaleString()}</span></div>
                  <div><span className="font-semibold text-slate-900">Admin note:</span> {bookingDetail.admin_note || 'No admin note yet'}</div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Participants</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div><span className="font-semibold text-slate-900">Seeker:</span> {bookingDetail.seeker?.name || 'Unknown'} ({bookingDetail.seeker?.email || 'No email'})</div>
                  <div><span className="font-semibold text-slate-900">Provider:</span> {bookingDetail.provider?.name || 'Unknown'} ({bookingDetail.provider?.email || 'No email'})</div>
                  <div><span className="font-semibold text-slate-900">Category:</span> {bookingDetail.service?.category?.name || 'Uncategorized'}</div>
                </CardBody>
              </Card>
            </div>
          </>
        ) : null}
      </AdminDetailPanel>
    </div>
  );
}
