package com.whatsapp.chat.service;



import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.whatsapp.chat.mapper.ChatMapper;
import com.whatsapp.chat.models.Chat;
import com.whatsapp.chat.models.ChatResponse;
import com.whatsapp.chat.models.User;
import com.whatsapp.chat.repository.ChatRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMapper mapper;
//    private final UserRepository userRepository;
    private final RestTemplate restTemplate= new RestTemplate();
    private final String USER_SERVICE_URL = "http://localhost:9292/api/v1/users/sender";


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
        String url1= UriComponentsBuilder.newInstance()
        		.scheme("http")
        		.host("localhost")
        		.path("/api/v1/users/sender")
        		.queryParam("publicId", senderId).toUriString();
        String url2= UriComponentsBuilder.newInstance()
        		.scheme("http")
        		.host("localhost")
        		.path("/api/v1/users/sender")
        		.queryParam("publicId", receiverId).toUriString();
        User sender= restTemplate.getForObject(url1,  User.class);
//        User sender= userRepository.findByPublicId(senderId)
//                .orElseThrow(()->new EntityNotFoundException("User with id " +senderId+" not found"));
        User receiver = restTemplate.getForObject(url2, User.class);
//        User receiver = userRepository.findByPublicId(receiverId)
//                .orElseThrow(()-> new EntityNotFoundException("user with id " +receiverId+"not found"));

        Chat chat= new Chat();
        chat.setSender(sender);
        chat.setRecipient(receiver);

        Chat savedChat= chatRepository.save(chat);
        return savedChat.getId();
    }

}
