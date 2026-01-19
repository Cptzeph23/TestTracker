import { useState } from "react";
import { useStore, Task } from "@/lib/store";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/task-modal";
import { TaskDetailsModal } from "@/components/task-details-modal";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function CalendarView() {
  const { tasks, users } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const getTasksForDay = (day: Date) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.filter(task => task?.date && isSameDay(new Date(task.date), day));
  };

  const getAssignee = (id: string) => users.find(u => u.id === id);

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-8 max-w-full mx-auto h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Schedule & Planning</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground tracking-tight">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <p className="text-muted-foreground font-medium">Policy Renewals, Claims & Appointments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-1">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={() => { setSelectedDate(new Date()); setIsTaskModalOpen(true); }} 
            className="gap-2 shadow-lg shadow-amber-500/20 bg-amber-500 text-black hover:bg-amber-400 font-semibold px-6 h-11"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 glass-panel rounded-2xl border shadow-xl overflow-hidden flex flex-col animate-in fade-in duration-700 delay-150">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-4 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr divide-x divide-y divide-zinc-200 dark:divide-zinc-800 bg-white/50 dark:bg-black/20">
          {days.map((day, dayIdx) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);
            
            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[140px] p-3 transition-all duration-200 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 cursor-pointer group relative flex flex-col gap-3",
                  !isCurrentMonth && "bg-zinc-50/80 dark:bg-zinc-900/80 opacity-60"
                )}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-all",
                    isToday 
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-110" 
                      : isCurrentMonth ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Add Button (Hover) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                     <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                       <Plus className="w-3 h-3" />
                     </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                  {dayTasks.map((task) => {
                    const assignee = getAssignee(task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => handleTaskClick(e, task)}
                        className={cn(
                          "text-xs p-2.5 rounded-lg border shadow-sm flex flex-col gap-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md group/card",
                          task.status === "done" 
                            ? "bg-emerald-50/80 border-emerald-100/50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
                            : task.status === "in-progress"
                            ? "bg-blue-50/80 border-blue-100/50 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                            : "bg-white border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 hover:border-amber-500/30"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold leading-tight">{task.title}</span>
                          <div className="shrink-0 opacity-70">
                            {task.status === "done" ? <CheckCircle2 className="w-3 h-3" /> : 
                             task.status === "in-progress" ? <Clock className="w-3 h-3" /> :
                             <Circle className="w-3 h-3" />}
                          </div>
                        </div>
                        
                        {(task.amount || task.policyNumber) && (
                          <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-1.5 mt-0.5">
                            <span className="font-mono text-[10px] font-medium opacity-80">
                               {task.policyNumber || "N/A"}
                            </span>
                            {task.amount && (
                              <Badge variant="secondary" className="h-4 px-1 text-[9px] font-bold bg-black/5 dark:bg-white/10">
                                {formatCurrency(task.amount)}
                              </Badge>
                            )}
                          </div>
                        )}

                        {assignee && (
                          <div className="flex items-center gap-1.5 mt-0.5 opacity-60 group-hover/card:opacity-100 transition-opacity">
                             <Avatar className="w-3.5 h-3.5">
                               <AvatarImage src={assignee.avatar} />
                               <AvatarFallback className="text-[8px]">{assignee.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <span className="text-[10px] truncate">{assignee.name.split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen} 
        defaultDate={selectedDate}
      />

      <TaskDetailsModal
        task={selectedTask}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </div>
  );
}
