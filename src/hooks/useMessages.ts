import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesAPI } from '../services/api';
import { toast } from 'sonner';

export const useMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesAPI.getAll,
  });

  const sendMessage = useMutation({
    mutationFn: messagesAPI.create,
    onSuccess: () => {
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    },
  });

  const markAsRead = useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) => messagesAPI.update(id, { isRead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Failed to update message:', error);
      toast.error('Failed to update message');
    },
  });

  const deleteMessage = useMutation({
    mutationFn: messagesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessage.mutate,
    markAsRead: markAsRead.mutate,
    deleteMessage: deleteMessage.mutate,
    isSending: sendMessage.isPending,
    isDeleting: deleteMessage.isPending,
  };
};
