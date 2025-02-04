package com.nikhil.whatsappclone.message;

import com.nikhil.whatsappclone.chat.Chat;
import com.nikhil.whatsappclone.chat.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final MessageMapper mapper;

    public void saveMessage(MessageRequest messageRequest){

        Chat chat= chatRepository.findById(messageRequest.getChatId())
                .orElseThrow(()-> new EntityNotFoundException("Chat not found"));

        Message message= new Message();
        message.setContent(messageRequest.getContent());
        message.setChat(chat);
        message.setSenderId(messageRequest.getSenderId());
        message.setReceiverId(messageRequest.getReceiverId());
        message.setType(messageRequest.getType());
        message.setState(MessageState.SENT);

        messageRepository.save(message);

        //todo Notification
    }

    public List<MessageResponse> findChatMessages(String chatId){
        return messageRepository.findMessagesByChatId(chatId)
                .stream()
                .map(mapper::toMessageResponse)
                .toList();
    }

    @Transactional
    //when updating data it is better practice to use Transactional
    public void setMessagesToSeen(String chatId, Authentication authentication){
        Chat chat= chatRepository.findById(chatId)
                .orElseThrow(()->new EntityNotFoundException("Chat not found"));

        final String recipientId = getRecipientId(chat, authentication);
        messageRepository.setMessagesToSeenByChatId(chatId, MessageState.SEEN);
    }

    public void uploadMediaMessage(String chatId, MultipartFile file, Authentication authentication){
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(()-> new EntityNotFoundException("Chat not found"));
        final String senderId = getSenderId(chat, authentication);
        final String recipientId = getRecipientId(chat, authentication);

    }

    private String getSenderId(Chat chat, Authentication authentication) {
        if(chat.getSender().getId().equals(authentication.getName())){
            return chat.getSender().getId();
        }
        return chat.getRecipient().getId();
    }

    private String getRecipientId(Chat chat, Authentication authentication) {
        if(chat.getSender().getId().equals(authentication.getName())){
            return chat.getRecipient().getId();
        }
        return chat.getSender().getId();
    }


}
