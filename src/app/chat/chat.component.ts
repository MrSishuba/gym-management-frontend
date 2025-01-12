import { Component } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: { user: string; bot: string }[] = [];
  userMessage: string = '';

  constructor(private chatService: ChatService) { }

  sendMessage() {
    if (this.userMessage.trim()) {
      const userMsg = this.userMessage.trim();
      this.messages.push({ user: userMsg, bot: '' });

      this.chatService.sendMessage(userMsg).subscribe((response: any) => {
        const botReply = response[0]?.text || 'No response';
        this.messages[this.messages.length - 1].bot = botReply;
      });

      this.userMessage = '';
    }
  }
}
