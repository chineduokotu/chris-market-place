import Badge from '../ui/Badge';

const variants = {
  active: 'success',
  approved: 'success',
  visible: 'success',
  completed: 'success',
  suspended: 'warning',
  pending: 'warning',
  flagged: 'warning',
  hidden: 'error',
  rejected: 'error',
  banned: 'error',
};

function formatStatus(value) {
  return String(value || 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AdminStatusBadge({ status }) {
  return <Badge variant={variants[status] || 'default'}>{formatStatus(status)}</Badge>;
}
