import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatResponse } from '../../services/models/chat-response';
import { ChatService, MessageService } from '../../services/services';
import { KeycloakService } from '../../utils/keycloak/keycloak.service';
import { MessageRequest, MessageResponse } from '../../services/models';
import { CommonModule } from '@angular/common';
import { EmojiData, EmojiModule, emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
@Component({
  selector: 'app-main',
  imports: [
    ChatListComponent,
    CommonModule,
    FormsModule,
    EmojiModule,
    PickerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent implements OnInit {
  chats: Array<ChatResponse> = [];
  messageContent: string = '';
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];
  showEmojis = false;
  socketClient: any = null;
  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef<HTMLDivElement>;
  private notificationSubscription: any;

  constructor(
    private chatService: ChatService,
    private keyCloakService: KeycloakService,
    private messageService: MessageService
  ) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  private scrollToBottom() {
    if (this.scrollableDiv) {
      const div = this.scrollableDiv.nativeElement;
      div.scrollTop = div.scrollHeight;
    }
  }
  ngOnInit(): void {
    this.getAllChats();
    //this.initWebSocket();
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
  private setMessagesToSeen() {
    this.messageService
      .setMessagesToSeen({
        'chat-id': this.selectedChat.id as string,
      })
      .subscribe({
        next: () => {},
      });
  }

  isSelfMessage(message: MessageResponse): boolean {
    return message.senderId === this.keyCloakService.userId;
  }

  getAllChatMessages(chatId: string) {
    this.messageService
      .getMessages({
        'chat-id': chatId,
      })
      .subscribe({
        next: (messages) => {
          this.chatMessages = messages;
        },
      });
  }

  uploadMedia(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const mediaLines = reader.result.toString().split(',')[1];
          this.messageService
            .uploadMedia({
              'chat-id': this.selectedChat.id as string,
              body: {
                file: file,
              },
            })
            .subscribe({
              next: () => {
                const message: MessageResponse = {
                  senderId: this.getSenderId(),
                  receiverId: this.getReceiverId(),
                  content: 'Attachment',
                  type: 'IMAGE',
                  state: 'SENT',
                  media: [mediaLines],
                  createdAt: new Date().toString(),
                };
                this.chatMessages.push(message);
              },
            });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSelectEmojis(emojiSelected: any) {
    const emoji: EmojiData = emojiSelected.emoji;
    this.messageContent += emoji.native;
  }

  onClick() {
    this.setMessagesToSeen();
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
  sendMessage() {
    if (this.messageContent) {
      const messageRequest: MessageRequest = {
        chatId: this.selectedChat.id,
        senderId: this.getSenderId(),
        receiverId: this.getReceiverId(),
        content: this.messageContent,
        type: 'TEXT',
      };
      this.messageService
        .saveMessage({
          body: messageRequest,
        })
        .subscribe({
          next: () => {
            const message: MessageResponse = {
              senderId: this.getSenderId(),
              receiverId: this.getReceiverId(),
              content: this.messageContent,
              type: 'TEXT',
              state: 'SENT',
              createdAt: new Date().toString(),
            };
            this.selectedChat.lastMessage = this.messageContent;
            this.chatMessages.push(message);
            this.messageContent = '';
            this.showEmojis = false;
          },
        });
    }
  }

  // private initWebSocket() {
  //   if (this.keyCloakService.keycloak.tokenParsed?.sub) {
  //     let ws = new SockJS('http://localhost:9292/ws');
  //     this.socketClient = Stomp.over(ws);
  //     const subUrl = `/user/${this.keyCloakService.keycloak.tokenParsed?.sub}/chat`;
  //     this.socketClient.connect(
  //       { Authorization: 'Bearer ' + this.keyCloakService.keycloak.token },
  //       () => {
  //         this.notificationSubscription = this.socketClient.subscribe(
  //           subUrl,
  //           (message: any) => {
  //             const notification: Notification = JSON.parse(message.body);
  //             // this.handleNotification(notification);
  //           },
  //           () => console.error('Error while connecting to websocket')
  //         );
  //       }
  //     );
  //   }
  // }
  private getReceiverId(): string {
    if (this.selectedChat.senderId === this.keyCloakService.userId) {
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat.receiverId as string;
  }
  private getSenderId(): string {
    if (this.selectedChat.senderId === this.keyCloakService.userId) {
      return this.selectedChat.receiverId as string;
    }
    return this.selectedChat.senderId as string;
  }
  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files[0];
  }
}
