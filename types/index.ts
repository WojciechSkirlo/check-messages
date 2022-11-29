interface Info {
  isGroup: boolean;
  totalMessages: number;
  yourMessages: number;
  firstMessage: Message;
  lastMessage: Message;
}

export interface Message {
  timestamp_ms: number;
  sender_name: string;
  content: string;
}

export interface JSON {
  title: string;
  thread_type: "Regular" | "RegularGroup";
  messages: Array<Message>;
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
