export interface ChatResponse {
  id?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  name?: string;
  receiverId?: string;
  recipientOnline?: boolean;
  senderId?: string;
  unreadCount?: number;
}
