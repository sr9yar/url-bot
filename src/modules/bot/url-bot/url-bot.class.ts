import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BOT_COMMAND_DELETE,
  BOT_COMMAND_FIND,
  BOT_COMMAND_HELP,
  BOT_COMMAND_LIST,
  BOT_COMMAND_SAVE,
  BOT_COMMAND_START,
  BOT_COMMANDS,
} from 'src/constants';
import { IMessageData } from '../interfaces/message-data.interface';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';
import * as TelegramBot from 'node-telegram-bot-api';

/**
 * Bot service class
 *
 * {@link https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md}
 */
@Injectable()
export class UrlBot extends TelegramBot {
  // Logger
  private readonly logger = new Logger(UrlBot.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userSessionService: UserSessionService,
  ) {
    const token: string = configService.get<string>('TELEGRAM_API_TOKEN');
    super(token, { polling: true });
  }
  /**
   * Initialize bot
   */
  async init(): Promise<UrlBot> {
    this.on('polling_error', this.logger.error);

    this.on('message', this.onMessage.bind(this));

    this.on('callback_query', this.onCallbackQuery.bind(this));

    await this.setMyCommands([
      {
        command: BOT_COMMAND_START,
        description: 'Start',
      },
      {
        command: BOT_COMMAND_HELP,
        description: 'Get help',
      },
      {
        command: BOT_COMMAND_FIND,
        description: 'Find one url by short code',
      },
      {
        command: BOT_COMMAND_SAVE,
        description: 'Save one url by short code',
      },
      {
        command: BOT_COMMAND_LIST,
        description: 'List all your urls',
      },
      {
        command: BOT_COMMAND_DELETE,
        description: 'Delete one url by short code',
      },
    ]);

    return this;
  }

  /**
   * On message callback
   * @param payload
   */
  async onMessage(payload: any): Promise<void> {
    this.logger.debug("Bot's got a new message.");
    // this.logger.debug(payload);

    const messageData = this.parsePayload(payload);

    const { chatId, message } = messageData;

    this.logger.debug(
      `The following message has just been received from chat id ${chatId}: ${message}`,
    );

    await this.performCommand(messageData);
  }

  /**
   * Parse payload
   * @param payload
   * @returns
   */
  private parsePayload(payload: any): IMessageData {
    const chatId = payload.chat?.id;
    const message = `${payload.text}`.trim();
    const firstName = payload.from?.first_name;
    const userId = payload.from?.id;

    return {
      command: this.parseCommandFromMessage(message),
      chatId,
      message,
      firstName,
      userId,
    };
  }

  /**
   * Parse command from message
   * @param message
   * @returns
   */
  private parseCommandFromMessage(message: string): string {
    let command: string = '';
    const parsedValue = message.trim().replace('/', '').toLowerCase();
    if (BOT_COMMANDS.includes(parsedValue)) {
      command = parsedValue;
    }
    return command;
  }

  /**
   * On menu selection callback
   * @param query
   */
  async onCallbackQuery(query: any): Promise<void> {
    const firstName: string = query.from?.first_name;
    const userId: number = query.from?.id;
    const command: string = query.data;

    const { chatId, message } = this.parsePayload(query.message);

    await this.performCommand({
      chatId,
      message,
      command,
      firstName,
      userId,
    });
  }

  /**
   * Perform action based on command
   * @param payload
   */
  private async performCommand(messageData: IMessageData): Promise<void> {
    const { chatId, command } = messageData;

    const lastCommand: string =
      await this.userSessionService.getLastCommand(chatId);

    this.logger.debug(
      `Command '${command}' has just been received from chat id ${chatId}. Last requested command was '${lastCommand || 'NONE'}'`,
    );

    if (!command && lastCommand) {
      switch (lastCommand) {
        case BOT_COMMAND_SAVE:
          this.emit('urlbot_on_save_user_input', messageData);

          break;
        case BOT_COMMAND_DELETE:
          this.emit('urlbot_on_delete_user_input', messageData);

          break;
        case BOT_COMMAND_FIND:
          this.emit('urlbot_on_find_user_input', messageData);

          break;
        default:
          await this.sendMessage(chatId, 'Please, send your command again.');
          break;
      }
      return;
    }

    switch (command) {
      case BOT_COMMAND_START:
        this.emit('urlbot_on_start', messageData);

        break;
      case BOT_COMMAND_HELP:
        this.emit('urlbot_on_help', messageData);

        break;
      case BOT_COMMAND_DELETE:
        this.emit('urlbot_on_delete', messageData);

        break;
      case BOT_COMMAND_LIST:
        this.emit('urlbot_on_list', messageData);

        break;
      case BOT_COMMAND_FIND:
        this.emit('urlbot_on_find', messageData);

        break;
      case BOT_COMMAND_SAVE:
        this.emit('urlbot_on_save', messageData);

        break;
      default:
        await this.sendMessage(
          chatId,
          "I'm limited to the commands I know.\nPlease, choose a command from the menu.",
        );
        break;
    }
  }
}
