import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStore, Task } from "@/lib/store";
import { format } from "date-fns";
import { Plus, CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayTasksModalProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (date: Date) => void;
  onSelectTask: (task: Task) => void;
}

export function DayTasksModal({ date, open, onOpenChange, onAddTask, onSelectTask }: DayTasksModalProps) {
  const { tasks, users, user } = useStore();
  if (!date) return null;
  const key = format(date, "yyyy-MM-dd");
  const dayTasks = Array.isArray(tasks) ? tasks.filter(t => t?.date === key) : [];

  const getAssignee = (id?: string) => users.find(u => u.id === id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden bg-zinc-950 border-amber-500/20">
        <div className="p-6 pb-3">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-amber-500">
              {format(date, "EEEE, MMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              {dayTasks.length} task{dayTasks.length === 1 ? "" : "s"}
            </div>
            {user?.role === 'admin' && (
              <Button
                size="sm"
                onClick={() => onAddTask(date)}
                className="gap-2 bg-amber-500 text-black hover:bg-amber-400"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            )}
          </div>
        </div>
        <div className="p-6 pt-3 space-y-3 max-h-[60vh] overflow-y-auto">
          {dayTasks.length === 0 ? (
            <div className="text-sm text-zinc-400 border border-dashed border-zinc-800 rounded-lg p-8 text-center">
              No tasks for this day
            </div>
          ) : (
            dayTasks.map(task => {
              const assignee = getAssignee((task as any).assigneeId);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={cn(
                    "p-3 rounded-lg border shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md",
                    task.status === "done"
                      ? "bg-emerald-50/5 border-emerald-900/40 text-emerald-300"
                      : task.status === "in-progress"
                      ? "bg-blue-50/5 border-blue-900/40 text-blue-300"
                      : "bg-zinc-900/40 border-zinc-800 text-zinc-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {task.status === "done" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : task.status === "in-progress" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{task.title}</div>
                        <div className="text-xs text-zinc-400 truncate">{task.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {task.policyNumber && (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                          {task.policyNumber}
                        </Badge>
                      )}
                      {assignee && (
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={assignee.avatar} />
                            <AvatarFallback className="text-[10px]">{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-zinc-400">{assignee.name.split(" ")[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
