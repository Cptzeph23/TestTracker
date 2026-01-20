import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, ShieldCheck } from "lucide-react";
import bgImage from "@assets/generated_images/professional_abstract_office_background_with_glass_and_light.png";
import logo from "@assets/18152e2c-9e0b-4100-8385-8fcf64ca11b7_1764764393554.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useStore();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Office Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[1px]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/80 border-amber-500/30 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-6 text-center pb-8 flex flex-col items-center">
            <div className="w-28 h-28 relative flex items-center justify-center rounded-full bg-black border-2 border-amber-500/20 shadow-amber-500/10 shadow-lg overflow-hidden p-2">
              <img 
                src={logo} 
                alt="SIMIA Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-display font-bold text-amber-500">SIMIA</CardTitle>
              <CardDescription className="text-zinc-400 uppercase tracking-widest text-xs font-medium">
                Insurance Agency Portal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-5 w-5 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="Agent ID / Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-zinc-900/50 border-amber-500/20 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-zinc-900/50 border-amber-500/20 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors"
              >
                Access Portal
              </Button>

              <div className="p-4 rounded-lg bg-zinc-900/50 border border-amber-500/10 text-xs text-zinc-500 space-y-3">
                <div className="flex items-center gap-2 text-amber-500/80 justify-center pb-2 border-b border-white/5">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="font-semibold">SECURE AGENT ACCESS</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex flex-col gap-1">
                    <span className="uppercase tracking-wider text-[10px]">Admin</span>
                    <code className="bg-black/50 px-2 py-1 rounded text-zinc-300 font-mono border border-zinc-800">admin</code>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="uppercase tracking-wider text-[10px]">Agent</span>
                    <code className="bg-black/50 px-2 py-1 rounded text-zinc-300 font-mono border border-zinc-800">jurgern</code>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
