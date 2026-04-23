import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, BadgeCheck, BriefcaseBusiness, Shield, UserMinus, UserRoundCog } from 'lucide-react';
import { adminApi } from '../../api/admin';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminDetailPanel from '../../components/admin/AdminDetailPanel';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminTable from '../../components/admin/AdminTable';
import { Button, Card, CardBody, CardHeader, EmptyState, Input, Select, Skeleton } from '../../components/ui';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-users', deferredSearch, status, role, page],
    queryFn: () => adminApi.listUsers({ q: deferredSearch, status, role, per_page: 20, page }),
  });

  const {
    data: userDetail,
    isLoading: isUserDetailLoading,
  } = useQuery({
    queryKey: ['admin-user', selectedUserId],
    queryFn: () => adminApi.getUser(selectedUserId),
    enabled: Boolean(selectedUserId),
  });

  const mutation = useMutation({
    mutationFn: async ({ type, userId }) => {
      if (type === 'suspend') {
        return adminApi.updateUserStatus(userId, {
          status: 'suspended',
          reason: 'Suspended from admin panel',
        });
      }

      if (type === 'activate') {
        return adminApi.updateUserStatus(userId, {
          status: 'active',
          reason: 'Reactivated from admin panel',
        });
      }

      return adminApi.updateUserAdminAccess(userId, {
        is_admin: type === 'grant-admin',
        reason: 'Admin permissions updated from admin panel',
      });
    },
    onSuccess: () => {
      setSelectedAction(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const rows = data?.data ?? [];

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <AdminFilters className="md:grid-cols-[minmax(0,1.5fr)_180px_180px_auto]">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search name, email, phone, WhatsApp"
        />
        <Select value={status} onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </Select>
        <Select value={role} onChange={(event) => {
          setRole(event.target.value);
          setPage(1);
        }}>
          <option value="">All roles</option>
          <option value="provider">Provider</option>
          <option value="seeker">Seeker</option>
        </Select>
        <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
          {data?.total ?? 0} users
        </div>
      </AdminFilters>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No users found" description="Try widening your search or removing one of the filters." />
      ) : (
        <AdminTable
          columns={[
            { key: 'name', label: 'User' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'admin', label: 'Admin' },
            { key: 'actions', label: 'Actions' },
          ]}
          isLoading={isLoading}
        >
          {rows.map((user) => (
            <tr key={user.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-600">{user.current_role}</td>
              <td className="px-5 py-4"><AdminStatusBadge status={user.status} /></td>
              <td className="px-5 py-4">
                {user.is_admin ? <AdminStatusBadge status="approved" /> : <span className="text-sm text-slate-500">No</span>}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant={user.status === 'active' ? 'secondary' : 'primary'}
                    onClick={() => setSelectedAction({ type: user.status === 'active' ? 'suspend' : 'activate', user })}
                  >
                    <UserMinus size={14} />
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedAction({ type: user.is_admin ? 'revoke-admin' : 'grant-admin', user })}
                  >
                    <Shield size={14} />
                    {user.is_admin ? 'Revoke admin' : 'Grant admin'}
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
        open={Boolean(selectedAction)}
        title={
          selectedAction?.type === 'suspend'
            ? 'Suspend this user?'
            : selectedAction?.type === 'activate'
              ? 'Reactivate this user?'
              : selectedAction?.type === 'grant-admin'
                ? 'Grant admin access?'
                : 'Revoke admin access?'
        }
        description={
          selectedAction
            ? `${selectedAction.user.name} will be updated immediately and the action will be recorded in audit logs.`
            : ''
        }
        confirmLabel="Apply change"
        loading={mutation.isPending}
        confirmVariant={selectedAction?.type === 'suspend' || selectedAction?.type === 'revoke-admin' ? 'destructive' : 'primary'}
        onCancel={() => setSelectedAction(null)}
        onConfirm={() => mutation.mutate({ type: selectedAction.type, userId: selectedAction.user.id })}
      >
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
              <UserRoundCog size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900">{selectedAction?.user?.name}</p>
              <p className="text-sm text-slate-500">{selectedAction?.user?.email}</p>
            </div>
          </div>
        </div>
      </AdminConfirmDialog>

      <AdminDetailPanel
        open={Boolean(selectedUserId)}
        title={userDetail?.user?.name || 'User details'}
        subtitle={userDetail?.user?.email}
        onClose={() => setSelectedUserId(null)}
      >
        {isUserDetailLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-[24px]" />)}
          </div>
        ) : userDetail ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserRoundCog size={18} className="text-slate-600" />
                    <h4 className="font-black text-slate-900">Account</h4>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Status</span><AdminStatusBadge status={userDetail.user.status} /></div>
                  <div className="flex items-center justify-between"><span>Role</span><span className="font-semibold text-slate-900">{userDetail.user.current_role}</span></div>
                  <div className="flex items-center justify-between"><span>Verification</span><span className="font-semibold text-slate-900">{userDetail.user.verification_level}</span></div>
                  <div className="flex items-center justify-between"><span>Admin access</span><span className="font-semibold text-slate-900">{userDetail.user.is_admin ? 'Yes' : 'No'}</span></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-amber-600" />
                    <h4 className="font-black text-slate-900">Activity</h4>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Services</span><span className="font-black text-slate-900">{userDetail.user.services_count}</span></div>
                  <div className="flex items-center justify-between"><span>Bookings as seeker</span><span className="font-black text-slate-900">{userDetail.user.bookings_as_seeker_count}</span></div>
                  <div className="flex items-center justify-between"><span>Bookings as provider</span><span className="font-black text-slate-900">{userDetail.user.bookings_as_provider_count}</span></div>
                  <div className="flex items-center justify-between"><span>Audit log actions</span><span className="font-black text-slate-900">{userDetail.user.admin_activity_logs_count}</span></div>
                </CardBody>
              </Card>
            </div>

            <Card>
              <CardHeader><h4 className="font-black text-slate-900">Recent Services</h4></CardHeader>
              <CardBody className="space-y-3">
                {userDetail.recent_services?.length ? userDetail.recent_services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness size={16} className="text-slate-500" />
                      <p className="font-semibold text-slate-900">{service.title}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{service.category?.name || 'Uncategorized'}</p>
                  </div>
                )) : <EmptyState title="No services yet" description="This user has not created any services." />}
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h4 className="font-black text-slate-900">Recent Reviews</h4></CardHeader>
              <CardBody className="space-y-3">
                {userDetail.recent_reviews?.length ? userDetail.recent_reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={16} className="text-amber-600" />
                      <p className="font-semibold text-slate-900">{review.service?.title || 'Service review'}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{review.comment || 'No comment left.'}</p>
                  </div>
                )) : <EmptyState title="No recent reviews" description="Review activity connected to this user will appear here." />}
              </CardBody>
            </Card>
          </>
        ) : null}
      </AdminDetailPanel>
    </div>
  );
}
