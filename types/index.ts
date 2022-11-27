interface Info {
  isGroup: boolean;
  totalMessages: number;
  yourMessages?: number;
  dates?: {
    firstMessage: string;
    lastMessage: string;
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
