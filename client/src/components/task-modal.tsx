import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  policyNumber: z.string().optional(),
  amount: z.string().transform((val) => (val === "" ? 0 : Number(val))),
  description: z.string().min(1, "Description is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["todo", "in-progress", "done"]),
});

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date | null;
}

export function TaskModal({ open, onOpenChange, defaultDate }: TaskModalProps) {
  const { users, addTask } = useStore();
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      policyNumber: "",
      amount: 0,
      description: "",
      assigneeId: "",
      date: "",
      status: "todo",
    },
  });

  useEffect(() => {
    if (defaultDate) {
      form.setValue("date", defaultDate.toISOString().split('T')[0]);
    }
  }, [defaultDate, form]);

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    addTask(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl border-amber-500/20 bg-zinc-950">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-display text-amber-500">New Policy Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Task / Policy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Life Insurance Renewal" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Policy No. (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="POL-0000" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Premium Value (KES)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Assign Agent</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:ring-amber-500/50">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id} className="flex items-center gap-2">
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:ring-amber-500/50">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">Pending Review</SelectItem>
                      <SelectItem value="in-progress">Processing</SelectItem>
                      <SelectItem value="done">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Notes / Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add policy details, client requirements, etc..." 
                      className="min-h-[100px] resize-none bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" size="lg" className="w-full bg-amber-500 text-black hover:bg-amber-400">Create Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
