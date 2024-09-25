import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import { DatabaseService } from '../../database/services/database/database.service';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { LinkDocument } from 'src/modules/database/database.module';
import { BaseAction } from './base.action';

@Injectable()
export class FindUserInputAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(FindUserInputAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly databaseService: DatabaseService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, message, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    await this.userSessionService.resetLastCommand(chatId);

    let link: LinkDocument =
      await this.databaseService.getLinkByShortCode(message);

    try {
      link = await this.databaseService.getLinkByShortCode(message);
    } catch (error) {
      await this.bot.sendMessage(chatId, `ERROR!\n${error.message}`);
    }

    if (!link) {
      await this.bot.sendMessage(chatId, `Your URL was not found.`);
      return;
    }

    await this.bot.sendMessage(chatId, `Your URL: ${link?.url}`);
  }
}
