import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaHash, setCaptchaHash] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const { login } = useAuth();

  const fetchCaptcha = async () => {
    try {
      const res = await authService.getCaptcha();
      setGeneratedCaptcha(res.captcha);
      setCaptchaHash(res.hash);
    } catch (err) {
      console.error("Failed to fetch captcha", err);
      toast.error("Gagal memuat captcha");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Reset attempts on mount (or use localStorage for persistence)
  useEffect(() => {
    const storedAttempts = localStorage.getItem('login_attempts');
    const blockTime = localStorage.getItem('block_time');
    
    if (blockTime) {
      const remaining = 300000 - (Date.now() - parseInt(blockTime)); // 5 minutes
      if (remaining > 0) {
        setIsBlocked(true);
        setTimeout(() => {
            setIsBlocked(false);
            setAttempts(0);
            localStorage.removeItem('block_time');
            localStorage.setItem('login_attempts', '0');
        }, remaining);
      } else {
         localStorage.removeItem('block_time');
         setAttempts(0);
      }
    } else if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) {
        toast.error("Sabar woi! Masih kena blokir kau.");
        return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password, captcha, captchaHash });
      // Reset on success
      setAttempts(0);
      localStorage.setItem('login_attempts', '0');
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());

      if (newAttempts >= 3) {
        setIsBlocked(true);
        localStorage.setItem('block_time', Date.now().toString());
        toast.error("Macam-macam kau ya! Uda kutandai IP mu!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

      <Card className="w-full max-w-md mx-4 relative z-10 border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-slate-400">
            Secure Access Area
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isBlocked && (
            <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-950/30 text-red-200 animate-pulse">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">WOI MAU NGAPAIN KAU?!</AlertTitle>
              <AlertDescription>
                Hayo uda tercatat ni IP mu! Lo siap-siap aku serang balik ya! Jangan coba-coba kau!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-slate-300">Username atau Email</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="admin atau admin@porto.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                disabled={isBlocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password"className="text-slate-300">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"
                disabled={isBlocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-slate-300">Kode Keamanan</Label>
              <div className="flex gap-2">
                <div className="select-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-emerald-400 w-32 text-center">
                  {generatedCaptcha}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchCaptcha}
                  className="border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Ganti Kode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                </Button>
              </div>
              <Input
                id="captcha"
                type="text"
                placeholder="Ketik kode di atas"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 uppercase"
                disabled={isBlocked}
              />
            </div>

            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300" 
                disabled={isSubmitting || isBlocked}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifikasi...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-600">
            <p>Protected by Medan-Cyber-Security System v2.0</p>
            <p className="mt-1">IP Address: Recorded</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
