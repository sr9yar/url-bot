import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import { UrlBot } from '../url-bot/url-bot.class';
import { URL_BOT } from '../url-bot/url-bot.token';
import { BaseAction } from './base.action';

@Injectable()
export class HelpAction implements BaseAction {
  // Logger
  private readonly logger = new Logger(HelpAction.name);

  constructor(
    private readonly userSessionService: UserSessionService,
    @Inject(URL_BOT) private readonly bot: UrlBot,
  ) {}

  async exec(messageData: IMessageData): Promise<void> {
    const { chatId, command } = messageData;

    this.logger.debug(`Running action ${command} for chat id ${chatId}.`);

    if (!chatId) {
      throw new Error("chatId parameter can't be empty");
    }

    await this.userSessionService.resetLastCommand(chatId);

    await this.bot.sendMessage(
      chatId,
      "Here you go.\nSmile! It's going to help.\n\nA programmer walks into a bar and ask for a drink. The bartender says I'll give you a drink if you tell me a programmer joke. And he says: a programmer walks into a bar and ask for a drink. The bartender says I'll give you a drink if you tell me a programmer joke. And he says: a programmer walks into a bar and ask for a drink. So he gives the guy a drink, so he gives the guy a drink, so he gives the guy a drink.",
    );
  }
}
