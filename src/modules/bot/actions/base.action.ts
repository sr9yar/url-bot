import { IMessageData } from '../interfaces/message-data.interface';

export abstract class BaseAction {
  async exec(messageData: IMessageData): Promise<void> {}
}
