import { Component, input, InputSignal } from '@angular/core';
import { ChatResponse } from '../../services/models/chat-response';
import {
  faTimesCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-list',
  imports: [],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  wrapMessage(lastMesssage: string | undefined): string {
    if (lastMesssage && lastMesssage.length <= 20) {
      return lastMesssage;
    }
    return lastMesssage?.substring(1, 17) + '...';
  }
  chatClicked(_t16: ChatResponse) {
    throw new Error('Method not implemented.');
  }
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact: boolean = false;
  searchContact() {}
}
