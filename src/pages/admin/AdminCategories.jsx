import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PencilLine, Tags } from 'lucide-react';
import { adminApi } from '../../api/admin';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import AdminErrorState from '../../components/admin/AdminErrorState';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminTable from '../../components/admin/AdminTable';
import { Button, Card, CardBody, CardHeader, EmptyState, Input } from '../../components/ui';

const emptyForm = {
  name: '',
  slug: '',
  group_name: '',
  icon: '',
};

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-categories', deferredSearch, page],
    queryFn: () => adminApi.listCategories({ q: deferredSearch, per_page: 15, page }),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingCategory) {
        return adminApi.updateCategory(editingCategory.id, payload);
      }

      return adminApi.createCategory(payload);
    },
    onSuccess: () => {
      setForm(emptyForm);
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId) => adminApi.deleteCategory(categoryId, {
      reason: 'Deleted from admin panel',
    }),
    onSuccess: () => {
      setCategoryToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const rows = data?.data ?? [];

  if (isError) {
    return <AdminErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_380px]">
      <div className="space-y-5">
        <AdminFilters className="md:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, slug, group or icon"
          />
          <div className="flex items-center justify-end text-sm font-semibold text-slate-500">
            {data?.total ?? 0} categories
          </div>
        </AdminFilters>

        {!isLoading && rows.length === 0 ? (
          <EmptyState title="No categories found" description="Create a category to organize services for providers." />
        ) : (
          <AdminTable
            columns={[
              { key: 'category', label: 'Category' },
              { key: 'group', label: 'Group' },
              { key: 'services', label: 'Services' },
              { key: 'actions', label: 'Actions' },
            ]}
            isLoading={isLoading}
          >
            {rows.map((category) => (
              <tr key={category.id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-900">{category.icon ? `${category.icon} ${category.name}` : category.name}</p>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{category.group_name || 'No group'}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700">{category.services_count}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingCategory(category);
                        setForm({
                          name: category.name || '',
                          slug: category.slug || '',
                          group_name: category.group_name || '',
                          icon: category.icon || '',
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={category.services_count > 0}
                      onClick={() => setCategoryToDelete(category)}
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
      </div>

      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              {editingCategory ? <PencilLine size={18} /> : <Tags size={18} />}
            </div>
            <div>
              <h3 className="text-lg font-black">{editingCategory ? 'Edit category' : 'Create category'}</h3>
              <p className="text-sm text-slate-500">Keep taxonomy clear and provider-friendly.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" />
          <Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Slug" />
          <Input value={form.group_name} onChange={(event) => setForm((current) => ({ ...current, group_name: event.target.value }))} placeholder="Group name" />
          <Input value={form.icon} onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))} placeholder="Icon or emoji" />
          <div className="flex flex-wrap gap-3">
            <Button
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.name || !form.slug}
            >
              {editingCategory ? 'Save changes' : 'Create category'}
            </Button>
            {editingCategory ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingCategory(null);
                  setForm(emptyForm);
                }}
              >
                Cancel edit
              </Button>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <AdminConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Delete category?"
        description={
          categoryToDelete
            ? `${categoryToDelete.name} will be removed permanently. This only works when there are no services linked to it.`
            : ''
        }
        confirmLabel="Delete category"
        confirmVariant="destructive"
        loading={deleteMutation.isPending}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => deleteMutation.mutate(categoryToDelete.id)}
      />
    </div>
  );
}
