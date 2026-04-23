import { useQuery } from '@tanstack/react-query';
import { Activity, BriefcaseBusiness, CalendarClock, ShieldCheck, Users } from 'lucide-react';
import { adminApi } from '../../api/admin';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { Card, CardBody, CardHeader, EmptyState, Skeleton } from '../../components/ui';

function formatDateTime(value) {
  if (!value) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="grid gap-5 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-40 rounded-[28px]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  const metrics = data?.metrics;
  const recent = data?.recent;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Users"
          value={metrics?.users?.total ?? 0}
          icon={Users}
          meta={`${metrics?.users?.admins ?? 0} admins, ${metrics?.users?.suspended ?? 0} suspended`}
        />
        <AdminStatCard
          label="Services"
          value={metrics?.services?.total ?? 0}
          icon={BriefcaseBusiness}
          tone="warm"
          meta={`${metrics?.services?.hidden ?? 0} hidden, ${metrics?.services?.pending ?? 0} pending`}
        />
        <AdminStatCard
          label="Bookings"
          value={metrics?.bookings?.total ?? 0}
          icon={CalendarClock}
          tone="cool"
          meta={`${metrics?.bookings?.pending ?? 0} pending, ${metrics?.bookings?.completed ?? 0} completed`}
        />
        <AdminStatCard
          label="Reviews"
          value={metrics?.reviews?.total ?? 0}
          icon={ShieldCheck}
          tone="success"
          meta={`${metrics?.reviews?.hidden ?? 0} hidden, ${metrics?.reviews?.flagged ?? 0} flagged`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1.15fr_1fr]">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-black">Recent Users</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {recent?.users?.length ? recent.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <AdminStatusBadge status={user.status} />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{user.current_role}</p>
                </div>
              </div>
            )) : <EmptyState title="No recent users" description="User signups will show here once activity starts." />}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-black">Recent Services</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {recent?.services?.length ? recent.services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">{service.title}</p>
                    <p className="text-sm text-slate-500">
                      {service.user?.name || 'Unknown provider'} - {service.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <AdminStatusBadge status={service.status} />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {formatDateTime(service.created_at)}
                </p>
              </div>
            )) : <EmptyState title="No recent services" description="Freshly created services will appear here." />}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-amber-500" />
              <h3 className="text-lg font-black">Audit Activity</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {recent?.activity?.length ? recent.activity.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">{entry.action}</p>
                <p className="mt-1 text-sm text-slate-500">{entry.admin?.name || 'Unknown admin'}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDateTime(entry.created_at)}</p>
              </div>
            )) : <EmptyState title="No admin activity yet" description="Audit events will appear here as actions are taken." />}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
