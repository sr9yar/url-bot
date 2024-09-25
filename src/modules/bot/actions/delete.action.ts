import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { BaseAction } from './base.action';

@Injectable()
export class DeleteAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(DeleteAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    await this.userSessionService.setLastCommand(chatId, command);

    await this.bot.sendMessage(chatId, `Now send me the short code.`);
  }
}
