import { CheckCircle, XCircle, Clock, Award, User, Tag, Calendar, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const statusConfig = {
  pending: { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, label: 'Pending Approval' },
  accepted: { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: CheckCircle, label: 'Active Service' },
  rejected: { color: 'text-slate-400 bg-slate-50 border-slate-100', icon: XCircle, label: 'Declined' },
  completed: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Award, label: 'Deliverable Completed' },
};

export default function BookingCard({ booking, isProvider, onStatusChange }) {
  const { startConversation } = useChat();
  const status = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = status.icon;

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
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/40 p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
               <StatusIcon size={12} />
               {status.label}
             </span>
             {booking.service?.category && (
               <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                 {booking.service.category.name}
               </span>
             )}
          </div>

          <div>
             <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
               {booking.service?.title || 'Untitled Service'}
             </h3>
             <div className="mt-2 flex flex-wrap items-center gap-4 py-1">
                <div className="flex items-center gap-2 text-slate-500">
                   <User size={14} className="text-slate-400" />
                   <span className="text-xs font-bold text-slate-700">
                     {isProvider ? booking.seeker?.name : booking.provider?.name}
                   </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 border-l border-slate-200 pl-4">
                   <Calendar size={14} className="text-slate-400" />
                   <span className="text-xs font-bold text-slate-700">
                     Requested {new Date(booking.created_at).toLocaleDateString()}
                   </span>
                </div>
             </div>
          </div>
          
          {booking.notes && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/20"></div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Request notes</p>
               <p className="text-sm text-slate-600 italic leading-relaxed">
                 "{booking.notes}"
               </p>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-end gap-4">
           <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</div>
               {/* Price removed */}
           </div>

           {isProvider && booking.status === 'pending' && (
             <div className="flex gap-2 w-full md:w-auto">
               <button
                 onClick={() => onStatusChange(booking.id, 'accepted')}
                 className="flex-1 px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
               >
                 Accept
               </button>
               <button
                 onClick={() => onStatusChange(booking.id, 'rejected')}
                 className="flex-1 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
               >
                 Decline
               </button>
             </div>
           )}

           {isProvider && booking.status === 'accepted' && (
             <div className="flex flex-col gap-2 w-full md:w-auto">
               <button
                 onClick={handleMessageSeeker}
                 className="w-full px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <MessageCircle size={14} /> Message Client
               </button>
               <button
                 onClick={() => onStatusChange(booking.id, 'completed')}
                 className="w-full px-8 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 Finalize & Complete <ChevronRight size={14} />
               </button>
             </div>
           )}

           {!isProvider && booking.status === 'accepted' && booking.provider && (
             <div className="flex gap-2 w-full md:w-auto">
               {booking.provider.phone && (
                 <a
                   href={`tel:${booking.provider.phone}`}
                   className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Phone size={14} /> Call
                 </a>
               )}
               <button
                 onClick={handleMessageProvider}
                 className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <MessageCircle size={14} /> Message
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

