package com.whatsapp.chat.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.whatsapp.chat.common.StringResponse;
import com.whatsapp.chat.models.ChatResponse;
import com.whatsapp.chat.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Tag(name="Chat")
public class ChatController {

    private final ChatService chatService;


    @PostMapping
    public ResponseEntity<StringResponse> createNewChat(
            @RequestParam (name="sender-id") String senderId,
            @RequestParam (name="receiver-id") String receiverId
    ) {
        final String chatId = chatService.createChat(senderId, receiverId);
        StringResponse stringResponse= StringResponse.builder()
                .response(chatId)
                .build();
        return  ResponseEntity.ok(stringResponse);
    }

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getAllChatsByReceiver(Authentication authentication){
        return ResponseEntity.ok(chatService.getChatsbyReceiverId(authentication));
    }

}
