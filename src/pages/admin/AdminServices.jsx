import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, PackageOpen, Star } from 'lucide-react';
import { adminApi } from '../../api/admin';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminDetailPanel from '../../components/admin/AdminDetailPanel';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminTable from '../../components/admin/AdminTable';
import { Button, Card, CardBody, CardHeader, EmptyState, Input, Select, Skeleton, Textarea } from '../../components/ui';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [dialogState, setDialogState] = useState(null);
  const [moderationNote, setModerationNote] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-services', deferredSearch, status, page],
    queryFn: () => adminApi.listServices({ q: deferredSearch, status, per_page: 20, page }),
  });

  const { data: serviceDetail, isLoading: isServiceDetailLoading } = useQuery({
    queryKey: ['admin-service', selectedServiceId],
    queryFn: () => adminApi.getService(selectedServiceId),
    enabled: Boolean(selectedServiceId),
  });

  const mutation = useMutation({
    mutationFn: async ({ type, serviceId }) => {
      if (type === 'delete') {
        return adminApi.deleteService(serviceId, {
          reason: moderationNote || 'Deleted from admin panel',
        });
      }

      return adminApi.updateServiceStatus(serviceId, {
        status: type,
        moderation_note: moderationNote,
        reason: moderationNote || 'Updated from admin panel',
      });
    },
    onSuccess: () => {
      setDialogState(null);
      setModerationNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const rows = data?.data ?? [];

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <AdminFilters className="md:grid-cols-[minmax(0,1.5fr)_190px_auto]">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search title, provider, category, location"
        />
        <Select value={status} onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}>
          <option value="">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="hidden">Hidden</option>
          <option value="rejected">Rejected</option>
        </Select>
        <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
          {data?.total ?? 0} services
        </div>
      </AdminFilters>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No services found" description="No services match the current filters." />
      ) : (
        <AdminTable
          columns={[
            { key: 'service', label: 'Service' },
            { key: 'provider', label: 'Provider' },
            { key: 'status', label: 'Status' },
            { key: 'note', label: 'Moderation' },
            { key: 'actions', label: 'Actions' },
          ]}
          isLoading={isLoading}
        >
          {rows.map((service) => (
            <tr key={service.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-bold text-slate-900">{service.title}</p>
                <p className="text-sm text-slate-500">{service.category?.name || 'Uncategorized'} - {service.location || 'No location'}</p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">{service.user?.name || 'Unknown'}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{service.user?.email}</p>
              </td>
              <td className="px-5 py-4"><AdminStatusBadge status={service.status} /></td>
              <td className="px-5 py-4 text-sm text-slate-500">{service.moderation_note || 'No note'}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    View
                  </Button>
                  {['approved', 'hidden', 'rejected'].map((nextStatus) => (
                    <Button
                      key={nextStatus}
                      size="sm"
                      variant={service.status === nextStatus ? 'primary' : 'secondary'}
                      onClick={() => {
                        setDialogState({ type: nextStatus, service });
                        setModerationNote(service.moderation_note || '');
                      }}
                    >
                      {nextStatus}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDialogState({ type: 'delete', service });
                      setModerationNote('');
                    }}
                  >
                    Delete
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
        open={Boolean(dialogState)}
        title={dialogState?.type === 'delete' ? 'Delete service?' : `Set service to ${dialogState?.type}?`}
        description={
          dialogState
            ? `${dialogState.service.title} will be updated and the action will be written to the audit log.`
            : ''
        }
        confirmLabel={dialogState?.type === 'delete' ? 'Delete service' : 'Update service'}
        confirmVariant={dialogState?.type === 'delete' ? 'destructive' : 'primary'}
        loading={mutation.isPending}
        onCancel={() => {
          setDialogState(null);
          setModerationNote('');
        }}
        onConfirm={() => mutation.mutate({ type: dialogState.type, serviceId: dialogState.service.id })}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
              <PackageOpen size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900">{dialogState?.service?.title}</p>
              <p className="text-sm text-slate-500">{dialogState?.service?.user?.name}</p>
            </div>
          </div>
          <Textarea
            rows={4}
            value={moderationNote}
            onChange={(event) => setModerationNote(event.target.value)}
            placeholder="Add an optional moderation note or reason"
          />
        </div>
      </AdminConfirmDialog>

      <AdminDetailPanel
        open={Boolean(selectedServiceId)}
        title={serviceDetail?.title || 'Service details'}
        subtitle={serviceDetail?.user?.name || 'Unknown provider'}
        onClose={() => setSelectedServiceId(null)}
      >
        {isServiceDetailLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-[24px]" />)}
          </div>
        ) : serviceDetail ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Moderation</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Status</span><AdminStatusBadge status={serviceDetail.status} /></div>
                  <div className="flex items-center justify-between"><span>Review count</span><span className="font-black text-slate-900">{serviceDetail.reviews_count ?? 0}</span></div>
                  <div className="flex items-center justify-between"><span>Average rating</span><span className="font-black text-slate-900">{serviceDetail.reviews_avg_rating ? Number(serviceDetail.reviews_avg_rating).toFixed(1) : 'None'}</span></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Details</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /><span>{serviceDetail.location || 'No location provided'}</span></div>
                  <div className="flex items-center gap-2"><Star size={14} className="text-amber-500" /><span>{serviceDetail.price ? `$${serviceDetail.price}` : 'Quote-based pricing'}</span></div>
                  <div><span className="font-semibold text-slate-900">Category:</span> {serviceDetail.category?.name || 'Uncategorized'}</div>
                </CardBody>
              </Card>
            </div>
            <Card>
              <CardHeader><h4 className="font-black text-slate-900">Description</h4></CardHeader>
              <CardBody>
                <p className="text-sm leading-7 text-slate-600">{serviceDetail.description}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><h4 className="font-black text-slate-900">Moderation Note</h4></CardHeader>
              <CardBody>
                <p className="text-sm text-slate-600">{serviceDetail.moderation_note || 'No moderation note has been recorded for this service.'}</p>
              </CardBody>
            </Card>
          </>
        ) : null}
      </AdminDetailPanel>
    </div>
  );
}
