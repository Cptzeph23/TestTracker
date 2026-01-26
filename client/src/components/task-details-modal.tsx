import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStore, Task } from "@/lib/store";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, User, Calendar, FileText, CreditCard, Hash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailsModal({ task, open, onOpenChange }: TaskDetailsModalProps) {
  const { users, updateTaskStatus, user: currentUser } = useStore();

  if (!task) return null;

  const assignee = users.find(u => u.id === task.assigneeId);
  const creator = users.find(u => u.id === task.creatorId);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "KES 0.00";
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const handleStatusChange = (value: string) => {
    updateTaskStatus(task.id, value as Task["status"]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-zinc-950 border-amber-500/20">
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <DialogTitle className="text-2xl font-display text-zinc-100 mb-2">{task.title}</DialogTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`
                  ${task.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    'bg-zinc-800 text-zinc-400 border-zinc-700'}
                `}>
                  {task.status === 'done' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                </Badge>
                {task.policyNumber && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono">
                    {task.policyNumber}
                  </Badge>
                )}
              </div>
            </div>
            
            {currentUser?.id === task.assigneeId && (
              <div className="w-[180px]">
                <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Pending Review</SelectItem>
                    <SelectItem value="in-progress">Processing</SelectItem>
                    <SelectItem value="done">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-zinc-800/50 border-y border-zinc-800">
          <div className="p-4 bg-zinc-900/50 flex flex-col gap-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Due Date
            </span>
            <span className="text-sm font-medium text-zinc-200">
              {format(new Date(`${task.date}T00:00:00`), "MMM d, yyyy")}
            </span>
          </div>
          <div className="p-4 bg-zinc-900/50 flex flex-col gap-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Premium
            </span>
            <span className="text-sm font-medium text-zinc-200">
              {formatCurrency(task.amount)}
            </span>
          </div>
          <div className="p-4 bg-zinc-900/50 flex flex-col gap-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Hash className="w-3 h-3" /> Task ID
            </span>
            <span className="text-sm font-medium text-zinc-200 font-mono truncate">
              #{task.id}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </h4>
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 min-h-[100px]">
              {task.description}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned Agent
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <Avatar>
                  <AvatarImage src={assignee?.avatar} />
                  <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{assignee?.name || "Unassigned"}</p>
                  <p className="text-xs text-zinc-500 truncate">@{assignee?.username}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Created By
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <Avatar>
                  <AvatarImage src={creator?.avatar} />
                  <AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{creator?.name || "Unknown"}</p>
                  <p className="text-xs text-zinc-500 truncate">@{creator?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full border-zinc-800 bg-black hover:bg-zinc-900 hover:text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
