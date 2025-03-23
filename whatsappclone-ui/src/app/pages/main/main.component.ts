import { Component, OnInit } from '@angular/core';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatResponse } from '../../services/models/chat-response';
import { ChatService, MessageService } from '../../services/services';
import { KeycloakService } from '../../utils/keycloak/keycloak.service';
import { MessageResponse } from '../../services/models';

@Component({
  selector: 'app-main',
  imports: [ChatListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  chats: Array<ChatResponse> = [];

  selectedChat: ChatResponse = {};
  chaMessages: MessageResponse[] = [];
  constructor(
    private chatService: ChatService,
    private keyCloakService: KeycloakService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getAllChats();
  }

  private getAllChats() {
    this.chatService.getChatsByReceiver().subscribe({
      next: (res) => {
        this.chats = res;
      },
    });
  }

  logout() {
    this.keyCloakService.logout();
  }
  userProfile() {
    this.keyCloakService.accountManagement();
  }

  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    console.log(this.selectedChat);

    this.getAllChatMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    // this.selectedChat.unreadCount = 0;
  }
  getAllChatMessages(chatId: string) {
    this.messageService
      .getMessages({
        'chat-id': chatId,
      })
      .subscribe({
        next: (messages) => {
          this.chaMessages = messages;
        },
      });
  }
  setMessagesToSeen() {
    throw new Error('Method not implemented.');
  }
}
