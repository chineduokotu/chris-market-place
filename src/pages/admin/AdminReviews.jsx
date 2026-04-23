import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminDetailPanel from '../../components/admin/AdminDetailPanel';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminTable from '../../components/admin/AdminTable';
import { Button, Card, CardBody, CardHeader, EmptyState, Input, Select, Skeleton, Textarea } from '../../components/ui';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [dialogState, setDialogState] = useState(null);
  const [moderationNote, setModerationNote] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-reviews', deferredSearch, status, page],
    queryFn: () => adminApi.listReviews({ q: deferredSearch, status, per_page: 20, page }),
  });

  const { data: reviewDetail, isLoading: isReviewDetailLoading } = useQuery({
    queryKey: ['admin-review', selectedReviewId],
    queryFn: () => adminApi.getReview(selectedReviewId),
    enabled: Boolean(selectedReviewId),
  });

  const mutation = useMutation({
    mutationFn: ({ reviewId, nextStatus }) => adminApi.updateReviewStatus(reviewId, {
      status: nextStatus,
      moderation_note: moderationNote,
      reason: moderationNote || 'Review updated from admin panel',
    }),
    onSuccess: () => {
      setDialogState(null);
      setModerationNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-review'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
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
          placeholder="Search by comment, provider, seeker or service"
        />
        <Select value={status} onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}>
          <option value="">All statuses</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="flagged">Flagged</option>
        </Select>
        <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
          {data?.total ?? 0} reviews
        </div>
      </AdminFilters>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No reviews found" description="Reviews that match your filters will show here." />
      ) : (
        <AdminTable
          columns={[
            { key: 'review', label: 'Review' },
            { key: 'participants', label: 'Participants' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          isLoading={isLoading}
        >
          {rows.map((review) => (
            <tr key={review.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-bold text-slate-900">{review.service?.title || 'Service review'}</p>
                <p className="mt-1 text-sm text-slate-500">{review.comment || 'No written comment'}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-amber-600">{review.rating}/5 rating</p>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">Provider: {review.provider?.name || 'Unknown'}</p>
                <p className="text-sm text-slate-500">Seeker: {review.seeker?.name || 'Unknown'}</p>
              </td>
              <td className="px-5 py-4"><AdminStatusBadge status={review.status} /></td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedReviewId(review.id)}
                  >
                    View
                  </Button>
                  {['visible', 'hidden', 'flagged'].map((nextStatus) => (
                    <Button
                      key={nextStatus}
                      size="sm"
                      variant={review.status === nextStatus ? 'primary' : 'secondary'}
                      onClick={() => {
                        setDialogState({ review, nextStatus });
                        setModerationNote(review.moderation_note || '');
                      }}
                    >
                      {nextStatus}
                    </Button>
                  ))}
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
        title={`Mark review as ${dialogState?.nextStatus || 'updated'}?`}
        description={dialogState ? 'This change affects what public review endpoints return.' : ''}
        confirmLabel="Save review status"
        loading={mutation.isPending}
        onCancel={() => {
          setDialogState(null);
          setModerationNote('');
        }}
        onConfirm={() => mutation.mutate({ reviewId: dialogState.review.id, nextStatus: dialogState.nextStatus })}
      >
        <Textarea
          rows={4}
          value={moderationNote}
          onChange={(event) => setModerationNote(event.target.value)}
          placeholder="Optional moderation note"
        />
      </AdminConfirmDialog>

      <AdminDetailPanel
        open={Boolean(selectedReviewId)}
        title={reviewDetail?.service?.title || 'Review details'}
        subtitle={reviewDetail ? `Review #${reviewDetail.id}` : ''}
        onClose={() => setSelectedReviewId(null)}
      >
        {isReviewDetailLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-[24px]" />)}
          </div>
        ) : reviewDetail ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Moderation</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Status</span><AdminStatusBadge status={reviewDetail.status} /></div>
                  <div className="flex items-center justify-between"><span>Rating</span><span className="font-black text-slate-900">{reviewDetail.rating}/5</span></div>
                  <div><span className="font-semibold text-slate-900">Note:</span> {reviewDetail.moderation_note || 'No moderation note yet'}</div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader><h4 className="font-black text-slate-900">Participants</h4></CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div><span className="font-semibold text-slate-900">Provider:</span> {reviewDetail.provider?.name || 'Unknown'}</div>
                  <div><span className="font-semibold text-slate-900">Seeker:</span> {reviewDetail.seeker?.name || 'Unknown'}</div>
                  <div><span className="font-semibold text-slate-900">Booking:</span> #{reviewDetail.booking_id}</div>
                </CardBody>
              </Card>
            </div>
            <Card>
              <CardHeader><h4 className="font-black text-slate-900">Comment</h4></CardHeader>
              <CardBody>
                <p className="text-sm leading-7 text-slate-600">{reviewDetail.comment || 'No written comment was included with this review.'}</p>
              </CardBody>
            </Card>
          </>
        ) : null}
      </AdminDetailPanel>
    </div>
  );
}
