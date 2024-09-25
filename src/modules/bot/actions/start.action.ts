import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import {
  BOT_COMMAND_DELETE,
  BOT_COMMAND_FIND,
  BOT_COMMAND_HELP,
  BOT_COMMAND_LIST,
  BOT_COMMAND_SAVE,
} from 'src/constants';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { BaseAction } from './base.action';

@Injectable()
export class StartAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(StartAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, firstName, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    const startMessage: string = `Hi, ${firstName}!\n\nUrlBot is here 👋\nLet me know what you\'d like to do now:`;

    await this.userSessionService.resetLastCommand(chatId);

    const keyboard: any = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Get help',
              callback_data: BOT_COMMAND_HELP,
            },
            {
              text: 'List all URLs',
              callback_data: BOT_COMMAND_LIST,
            },
          ],
          [
            {
              text: 'Delete one URL',
              callback_data: BOT_COMMAND_DELETE,
            },
          ],
          [
            {
              text: 'Display one URL by short code',
              callback_data: BOT_COMMAND_FIND,
            },
          ],
          [
            {
              text: 'Save a URL',
              callback_data: BOT_COMMAND_SAVE,
            },
          ],
        ],
      },
    };

    this.bot.sendMessage(chatId, startMessage, keyboard);
  }
}
