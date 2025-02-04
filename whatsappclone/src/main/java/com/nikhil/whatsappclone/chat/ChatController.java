package com.nikhil.whatsappclone.chat;


import com.nikhil.whatsappclone.common.StringResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;


    @PostMapping
    public ResponseEntity<StringResponse> createChat(
            @RequestParam (name "sender-id") String senderId,
            @RequestParam (name "receiver-id") String receiverId
    ) {
        final String chatId = chatService.createChat(senderId, receiverId);
        StringResponse stringResponse= StringResponse.builder()
                .response(chatId)
                .build();
        return  ResponseEntity.ok(stringResponse);
    }

    public ResponseEntity<List<ChatResponse>> getChatsByReceiver(Authentication authentication){
        return ResponseEntity.ok(chatService.getChatsbyReceiverId(authentication));
    }

}
