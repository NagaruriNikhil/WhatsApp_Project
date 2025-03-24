import { Component, input, InputSignal, output } from '@angular/core';
import { ChatResponse } from '../../services/models/chat-response';
import { CommonModule, DatePipe } from '@angular/common';
import { UserResponse } from '../../services/models';
import { UserService } from '../../services/services';
import { ChatService } from '../../services/services';
import { KeycloakService } from '../../utils/keycloak/keycloak.service';
@Component({
  selector: 'app-chat-list',
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  chatSelected = output<ChatResponse>();
  wrapMessage(lastMesssage: string | undefined): string {
    if (lastMesssage && lastMesssage.length <= 20) {
      return lastMesssage;
    }
    return lastMesssage?.substring(1, 17) + '...';
  }
  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }
  searchNewContact: boolean = false;
  contacts: Array<UserResponse> = [];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private keyCloakService: KeycloakService
  ) {}

  searchContact() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.contacts = users;
        this.searchNewContact = true;
      },
    });
  }

  selectContact(contact: UserResponse) {
    this.chatService
      .createChat({
        'sender-id': this.keyCloakService.userId as string,
        'receiver-id': contact.id as string,
      })
      .subscribe({
        next: (res) => {
          const chat: ChatResponse = {
            id: res.response,
            name: contact.firstName + ' ' + contact.lastName,
            recipientOnline: contact.online,
            lastMessageTime: contact.lastSeen,
            senderId: this.keyCloakService.userId,
            receiverId: contact.id,
          };
          this.chats().unshift(chat);
          this.searchNewContact = false;
          this.chatSelected.emit(chat);
        },
      });
  }
}
