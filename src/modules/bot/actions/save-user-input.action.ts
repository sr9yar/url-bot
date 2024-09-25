import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import { DatabaseService } from '../../database/services/database/database.service';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { LinkDocument } from 'src/modules/database/database.module';
import { BaseAction } from './base.action';

@Injectable()
export class SaveUserInputAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(SaveUserInputAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly databaseService: DatabaseService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, message, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    await this.userSessionService.resetLastCommand(chatId);

    let link: LinkDocument;

    try {
      link = await this.databaseService.saveUrl(message, chatId);
    } catch (error) {
      await this.bot.sendMessage(chatId, `ERROR!\n${error.message}`);
    }

    if (!link) {
      await this.bot.sendMessage(chatId, `Your URL was not saved.`);
      return;
    }

    await this.bot.sendMessage(
      chatId,
      `You short code is ${link.shortCode}\nRemember it!`,
    );
  }
}
