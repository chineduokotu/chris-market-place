import { Calendar, CheckCircle2, Clock, MessageCircle, Phone, User, XCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Card, CardBody } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const statusConfig = {
  pending: { label: 'Pending', badge: 'warning', icon: Clock },
  accepted: { label: 'Accepted', badge: 'verified', icon: CheckCircle2 },
  rejected: { label: 'Declined', badge: 'error', icon: XCircle },
  completed: { label: 'Completed', badge: 'success', icon: CheckCircle2 },
};

export default function BookingCard({ booking, isProvider, onStatusChange }) {
  const { startConversation } = useChat();
  const config = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleMessageProvider = async () => {
    if (booking.provider?.id) {
      await startConversation(booking.provider.id, booking.id);
    }
  };

  const handleMessageSeeker = async () => {
    if (booking.seeker?.id) {
      await startConversation(booking.seeker.id, booking.id);
    }
  };

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[var(--color-text)]">{booking.service?.title || 'Untitled service'}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <User size={14} />
                {isProvider ? booking.seeker?.name : booking.provider?.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(booking.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge variant={config.badge} className="capitalize">
            <StatusIcon size={12} />
            {config.label}
          </Badge>
        </div>

        {booking.notes ? (
          <div className="rounded-[12px] border border-[var(--color-border)] bg-slate-50 p-3 text-sm text-[var(--color-muted)]">
            {booking.notes}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {isProvider && booking.status === 'pending' ? (
            <>
              <Button size="sm" onClick={() => onStatusChange(booking.id, 'accepted')}>
                Accept
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onStatusChange(booking.id, 'rejected')}>
                Decline
              </Button>
            </>
          ) : null}

          {isProvider && booking.status === 'accepted' ? (
            <>
              <Button size="sm" variant="secondary" onClick={handleMessageSeeker}>
                <MessageCircle size={14} />
                Message Client
              </Button>
              <Button size="sm" onClick={() => onStatusChange(booking.id, 'completed')}>
                Complete Job
              </Button>
            </>
          ) : null}

          {!isProvider && booking.status === 'accepted' && booking.provider ? (
            <>
              {booking.provider.phone ? (
                <a href={`tel:${booking.provider.phone}`}>
                  <Button size="sm" variant="secondary">
                    <Phone size={14} />
                    Call
                  </Button>
                </a>
              ) : null}
              <Button size="sm" onClick={handleMessageProvider}>
                <MessageCircle size={14} />
                Message
              </Button>
            </>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

