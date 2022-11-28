interface Info {
  isGroup: boolean;
  totalMessages: number;
  yourMessages: number;
  whoStartConversation: string;
  dates: {
    timestampFirstMessage: number;
    timestampLastMessage: number;
  };
}

export interface User {
  id: string;
  name: string;
  ranking: number;
  info: Info;
}

export interface Validation {
  is: boolean | null;
  message: string;
}
