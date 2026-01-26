import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Reply,
  MoreHorizontal,
  Download,
  Users,
  Loader2,
} from 'lucide-react';

import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useAdminStore, type Message } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Inbox = () => {
  const {
    messages,
    subscribers,
    markMessageRead,
    markMessageUnread,
    archiveMessage,
    deleteMessage,
    deleteMessages,
    deleteSubscriber,
    exportSubscribers,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageSheetOpen, setMessageSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState('inbox');

  // Filter messages
  const filteredMessages = useMemo(() => {
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.filter(m =>
      (m.senderName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    if (!subscribers || !Array.isArray(subscribers)) return [];
    return subscribers.filter(s =>
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subscribers, searchQuery]);

  const unreadCount = messages && Array.isArray(messages) ? messages.filter(m => !m.isRead).length : 0;

  const handleOpenMessage = (message: Message) => {
    setSelectedMessage(message);
    setMessageSheetOpen(true);
    if (!message.isRead) {
      markMessageRead(message.id);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      deleteMessages(selectedIds);
      setSelectedIds([]);
      setDeleteDialogOpen(false);
      toast.success(`${selectedIds.length} pesan dihapus`);
    }
  };

  const handleExportSubscribers = () => {
    const csv = exportSubscribers();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Pelanggan diekspor ke CSV');
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
    toast.success('Membuka klien email...');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Kotak Masuk</h1>
          <p className="text-muted-foreground mt-1">Kelola pesan dan pelanggan</p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="inbox" className="relative">
                Kotak Masuk
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="subscribers">
                <Users className="h-4 w-4 mr-2" />
                Pelanggan
              </TabsTrigger>
            </TabsList>

            {tab === 'subscribers' && (
              <Button variant="outline" onClick={handleExportSubscribers}>
                <Download className="h-4 w-4 mr-2" />
                Ekspor CSV
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tab === 'subscribers' ? 'Cari pelanggan...' : 'Cari pesan...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bulk Actions for Messages */}
          {tab === 'inbox' && selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 glass rounded-xl mt-4"
            >
              <span className="text-sm font-medium">{selectedIds.length} dipilih</span>
              <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </motion.div>
          )}

          {/* Messages Tab */}
          <TabsContent value="inbox" className="mt-4">
            {filteredMessages.length === 0 ? (
              <EmptyState
                icon="inbox"
                title="Tidak ada pesan"
                description="Kotak masuk Anda kosong. Pesan baru akan muncul di sini."
              />
            ) : (
              <div className="glass rounded-xl divide-y divide-border">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleOpenMessage(message)}
                    className={cn(
                      "flex items-start gap-4 cursor-pointer table-row-hover p-4",
                      !message.isRead && "bg-primary/5"
                    )}
                  >
                    <Checkbox
                      className="mt-1"
                      checked={selectedIds.includes(message.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds([...selectedIds, message.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== message.id));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!message.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                        <span className={cn("font-medium truncate", !message.isRead && "text-foreground")}>
                          {message.senderName}
                        </span>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          &lt;{message.email}&gt;
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm mt-1 truncate",
                        message.isRead ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {formatDate(message.createdAt)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleReply(message.email);
                          }}>
                            <Reply className="h-4 w-4 mr-2" />
                            Balas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            if (message.isRead) {
                              markMessageUnread(message.id);
                            } else {
                              markMessageRead(message.id);
                            }
                            toast.success(message.isRead ? 'Ditandai sebagai belum dibaca' : 'Ditandai sebagai sudah dibaca');
                          }}>
                            {message.isRead ? (
                              <>
                                <Mail className="h-4 w-4 mr-2" />
                                Tandai Belum Dibaca
                              </>
                            ) : (
                              <>
                                <MailOpen className="h-4 w-4 mr-2" />
                                Tandai Dibaca
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(message.id);
                              toast.success('Pesan dihapus');
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>



          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="mt-4">
            {filteredSubscribers.length === 0 ? (
              <EmptyState
                icon="users"
                title="Tidak ada pelanggan"
                description="Pelanggan nawala akan muncul di sini."
              />
            ) : (
              <div className="glass rounded-xl divide-y divide-border">
                {filteredSubscribers.map((subscriber, index) => (
                  <motion.div
                    key={subscriber.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 table-row-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Berlangganan sejak {formatDate(subscriber.subscribedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={subscriber.status === 'active' ? 'badge-success' : 'badge-muted'}>
                        {subscriber.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteSubscriber(subscriber.id);
                          toast.success('Pelanggan dihapus');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

      {/* Message Detail Sheet */}
      <Sheet open={messageSheetOpen} onOpenChange={setMessageSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedMessage && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedMessage.subject}</SheetTitle>
                <SheetDescription>
                  Dari: {selectedMessage.senderName} &lt;{selectedMessage.email}&gt;
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Diterima: {formatDate(selectedMessage.createdAt)}
                </p>
                <ScrollArea className="h-[60vh]">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </ScrollArea>
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => handleReply(selectedMessage.email)} className="flex-1 btn-neon">
                    <Reply className="h-4 w-4 mr-2" />
                    Balas
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        await archiveMessage(selectedMessage.id);
                        setMessageSheetOpen(false);
                        toast.success('Pesan diarsipkan');
                      } catch (error) {
                        toast.error('Gagal mengarsipkan pesan');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    disabled={isSubmitting}
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        await deleteMessage(selectedMessage.id);
                        setMessageSheetOpen(false);
                        toast.success('Pesan dihapus');
                      } catch (error) {
                        toast.error('Gagal menghapus pesan');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Pesan Terpilih"
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.length} pesan? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDeleteSelected}
        confirmText="Hapus"
        variant="destructive"
      />
    </div>
  );
};

export default Inbox;
