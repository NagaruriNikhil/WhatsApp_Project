package com.nikhil.whatsappclone.chat;


import org.springframework.stereotype.Service;

@Service
public class ChatMapper {
    public ChatResponse toChatResponse(Chat c, String senderId) {
        return  ChatResponse.builder()
                .id(c.getId())
                .name(c.getChatName(senderId))
                .unreadCount(c.getUnreadMessagesCount(senderId))
                .lastMessage(c.getLastMessage())
                .isRecipientOnline(c.getRecipient().isUserOnline())
                .senderId(c.getSender().getId())
                .receiverId(c.getRecipient().getId())
                .lastMessageTime(c.getLastMessageTime())
                .build();
    }
}
