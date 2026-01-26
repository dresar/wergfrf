import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Inbox,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  // Bell, // Commented out temporarily
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Command,
  GraduationCap,
  Award,
  Briefcase,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminStore } from '@/store/adminStore';
import { useProfile } from '@/hooks/useProfile';
import { cn, normalizeMediaUrl } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { toast } from 'sonner';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dasbor', href: '/admin' },
  { icon: FolderKanban, label: 'Proyek', href: '/admin/projects' },
  { icon: FileText, label: 'Blog', href: '/admin/blog' },
  { icon: User, label: 'Tentang Saya', href: '/admin/content' },
  { icon: Code2, label: 'Keahlian', href: '/admin/skills' },
  { icon: Briefcase, label: 'Pengalaman', href: '/admin/experience' },
  { icon: GraduationCap, label: 'Pendidikan', href: '/admin/education' },
  { icon: Award, label: 'Sertifikat', href: '/admin/certificates' },
  { icon: MessageSquare, label: 'Template WA', href: '/admin/wa-templates' },
  { icon: Inbox, label: 'Kotak Masuk', href: '/admin/inbox' },
  { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { 
    theme, 
    toggleTheme, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    messages,
    exportAllData,
    fetchInitialData
  } = useAdminStore();
  const { profile } = useProfile();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const unreadMessages = messages.filter(m => !m.isRead).length;

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 17) setGreeting('Selamat Siang');
    else setGreeting('Selamat Malam');
  }, [currentTime]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data berhasil diekspor!');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-semibold text-lg gradient-primary-text">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              const showBadge = item.label === 'Kotak Masuk' && unreadMessages > 0;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => cn(
                    'sidebar-item group relative',
                    isActive && 'sidebar-item-active'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {showBadge && (
                        <Badge
                          variant="secondary"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]"
                        >
                          {unreadMessages}
                        </Badge>
                      )}
                      {!sidebarCollapsed && item.children && (
                        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User */}
        <div className="p-3 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg",
            sidebarCollapsed && "justify-center"
          )}>
            <img
              src={profile?.heroImageFile || profile?.heroImage || '/placeholder-avatar.png'}
              alt={profile?.fullName || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
            />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium truncate">{profile?.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.role || 'Peran'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <span className="font-semibold text-lg gradient-primary-text">Admin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 py-4 h-[calc(100vh-8rem)]">
                <nav className="px-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const showBadge = item.label === 'Kotak Masuk' && unreadMessages > 0;

                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => cn('sidebar-item', isActive && 'sidebar-item-active')}
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                            <span>{item.label}</span>
                            {showBadge && (
                              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs ml-auto">
                                {unreadMessages}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </ScrollArea>

              <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src={normalizeMediaUrl(profile?.heroImageFile || profile?.heroImage) || '/placeholder-avatar.png'}
                    alt={profile?.fullName || 'User'}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.fullName || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.role || 'Peran'}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-[260px]"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors w-64"
            >
              <Search className="h-4 w-4" />
              <span>Cari...</span>
              <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border">
                <Command className="h-3 w-3 inline mr-0.5" />K
              </kbd>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Time & Greeting */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs text-muted-foreground">{greeting}</span>
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications - Placeholder */}
            <Button variant="ghost" size="icon" disabled>
              <span className="h-5 w-5">🔔</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <img
                    src={profile?.heroImageFile || profile?.heroImage || '/placeholder-avatar.png'}
                    alt={profile?.fullName || 'User'}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{profile?.fullName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.greeting || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Pengaturan Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ekspor Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Cari halaman, pengaturan, tindakan..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          <CommandGroup heading="Halaman">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    setCommandOpen(false);
                    navigate(item.href);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Tindakan">
            <CommandItem onSelect={() => { toggleTheme(); setCommandOpen(false); }}>
              {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Ubah Tema
            </CommandItem>
            <CommandItem onSelect={() => { handleExportData(); setCommandOpen(false); }}>
              <FileText className="mr-2 h-4 w-4" />
              Ekspor Semua Data
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
