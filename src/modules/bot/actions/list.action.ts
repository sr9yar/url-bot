import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import { DatabaseService } from '../../database/services/database/database.service';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { LinkDocument } from 'src/modules/database/database.module';
import { BaseAction } from './base.action';

@Injectable()
export class ListAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(ListAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly databaseService: DatabaseService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    await this.userSessionService.resetLastCommand(chatId);

    const list: LinkDocument[] = await this.databaseService.getAllLinks(chatId);

    let message: string = '';

    if (!list.length) {
      message = 'No URLs were saved yet.';
    }
    for (let i = 0; i < list.length; i++) {
      if (i > 0) {
        message += '\n';
      }
      const shortCode = list[i].shortCode;
      const url = list[i].url;

      message += `${shortCode}\t${url}`;
    }

    await this.bot.sendMessage(chatId, message);
  }
}
