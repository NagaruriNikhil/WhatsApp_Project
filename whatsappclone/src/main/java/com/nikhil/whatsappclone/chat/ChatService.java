package com.nikhil.whatsappclone.chat;


import com.nikhil.whatsappclone.user.User;
import com.nikhil.whatsappclone.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMapper mapper;
    private final UserRepository userRepository;

    @Transactional
    public List<ChatResponse> getChatsbyReceiverId(Authentication currentUser){
        final String userId = currentUser.getName();
        return chatRepository.findChatsBySenderId(userId)
                .stream()
                .map(c -> mapper.toChatResponse(c, userId))
                .toList();
    }

    public String createChat(String senderId, String receiverId){
        Optional<Chat> existingChat = chatRepository.findChatsByReceiverAndSender(senderId, receiverId);
        if(existingChat.isPresent()){
            return existingChat.get().getId();
        }
        User sender= userRepository.findByPublicId(senderId)
                .orElseThrow(()->new EntityNotFoundException("User with id " +senderId+" not found"));

        User receiver = userRepository.findByPublicId(receiverId)
                .orElseThrow(()-> new EntityNotFoundException("user with id " +receiverId+"not found"));

        Chat chat= new Chat();
        chat.setSender(sender);
        chat.setRecipient(receiver);

        Chat savedChat= chatRepository.save(chat);
        return savedChat.getId();
    }

}
