import { Component, input, InputSignal, output } from '@angular/core';
import { ChatResponse } from '../../services/models/chat-response';
import { CommonModule, DatePipe } from '@angular/common';
import { UserResponse } from '../../services/models';
import { UserService } from '../../services/services';
@Component({
  selector: 'app-chat-list',
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  selectContact(_t34: UserResponse) {
    throw new Error('Method not implemented.');
  }

  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  chatSelected = output<ChatResponse>();
  wrapMessage(lastMesssage: string | undefined): string {
    if (lastMesssage && lastMesssage.length <= 20) {
      return lastMesssage;
    }
    return lastMesssage?.substring(1, 17) + '...';
  }
  chatClicked(chat: ChatResponse) {
    console.log(chat);
    this.chatSelected.emit(chat);
    console.log(chat);
  }
  searchNewContact: boolean = false;
  contacts: Array<UserResponse> = [];

  constructor(private userService: UserService) {}

  searchContact() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.contacts = users;
        this.searchNewContact = true;
      },
    });
  }
}
