export interface IMessageData {
  command: string;
  message: string;
  chatId: number;
  userId?: number;
  firstName?: string;
}
