import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "employee"]),
});

export function UserManagement() {
  const { users, addUser } = useStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      name: "",
      role: "employee",
    },
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    // Check if username already exists
    if (users.some(u => u.username === values.username)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username already taken. Please choose another.",
      });
      return;
    }

    addUser(values);
    form.reset();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-amber-500">Team Management</h2>
        <p className="text-zinc-400 mt-1">Onboard new agents and staff members</p>
      </div>

      <div className="grid md:grid-cols-[350px_1fr] gap-8">
        <Card className="h-fit border-amber-500/20 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-amber-500">Onboard New Member</CardTitle>
            <CardDescription>Create access credentials for a new team member.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sarah Johnson" {...field} className="bg-zinc-900 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Username (Login ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. sarahj" {...field} className="bg-zinc-900 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employee">Agent / Employee</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-400">Create Account</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 content-start">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow border-zinc-800 bg-zinc-900/50">
              <div className={`h-2 w-full ${user.role === 'admin' ? 'bg-amber-500' : 'bg-zinc-700'}`} />
              <CardContent className="pt-6 flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-zinc-800 shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-zinc-200">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="capitalize text-amber-500/80">{user.role}</span>
                    <span>•</span>
                    <span className="font-mono bg-black/30 px-1 rounded">@{user.username}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
