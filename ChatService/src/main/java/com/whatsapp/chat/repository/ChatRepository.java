package com.whatsapp.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.whatsapp.chat.constants.ChatConstants;
import com.whatsapp.chat.models.Chat;

import java.util.List;
import java.util.Optional;

public interface ChatRepository  extends JpaRepository<Chat, String> {

    @Query(name = ChatConstants.FIND_CHAT_BY_SENDER_ID)
    List<Chat> findChatsBySenderId(@Param("senderId") String userId);

    @Query(name = ChatConstants.FIND_CHAT_BY_SENDER_ID_AND_RECEIVER)
    Optional<Chat> findChatsByReceiverAndSender(@Param("senderId") String senderId,@Param("recipientId") String receiverId);
}
