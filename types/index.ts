interface Info {
  isGroup: boolean;
  totalMessages: number;
  firstMessage: Message;
  lastMessage: Message;
}

export interface Message {
  timestamp_ms: number;
  sender_name: string;
  content: string;
}

export interface JSON {
  is_still_participant: boolean;
  magic_words: unknown[];
  messages: Array<Message>;
  participants: Array<Participant>;
  thread_path: string;
  title: string;
}
export interface User {
  id: string;
  name: string;
  ranking: number | null;
  info: Info;
}

export interface Validation {
  is: boolean | null;
  message: string;
}

interface Participant {
  name: string;
}
