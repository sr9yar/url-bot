import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageData } from '../../interfaces/message-data.interface';
import { URL_BOT } from '../../url-bot/url-bot.token';
import { UrlBot } from '../../url-bot/url-bot.class';
import { StartAction } from '../../actions/start.action';
import { HelpAction } from '../../actions/help.action';
import { FindAction } from '../../actions/find.action';
import { ListAction } from '../../actions/list.action';
import { DeleteAction } from '../../actions/delete.action';
import { SaveAction } from '../../actions/save.action';
import { FindUserInputAction } from '../../actions/find-user-input.action';
import { DeleteUserInputAction } from '../../actions/delete-user-input.action';
import { SaveUserInputAction } from '../../actions/save-user-input.action';

/**
 * Bot service class
 */
@Injectable()
export class BotService {
  // Telegram Bot
  private readonly bot;

  // Logger
  private readonly logger = new Logger(BotService.name);

  constructor(
    @Inject(URL_BOT) private readonly urlBot: UrlBot,

    private readonly startAction: StartAction,
    private readonly helpAction: HelpAction,
    private readonly findAction: FindAction,
    private readonly listAction: ListAction,
    private readonly deleteAction: DeleteAction,
    private readonly saveAction: SaveAction,

    private readonly findUserInputAction: FindUserInputAction,
    private readonly deleteUserInputAction: DeleteUserInputAction,
    private readonly saveUserInputAction: SaveUserInputAction,
  ) {
    this.bot = this.urlBot;

    this.bot.on('urlbot_on_start', this.onStart.bind(this));
    this.bot.on('urlbot_on_find', this.onFind.bind(this));
    this.bot.on('urlbot_on_help', this.onHelp.bind(this));
    this.bot.on('urlbot_on_delete', this.onDelete.bind(this));
    this.bot.on('urlbot_on_list', this.onList.bind(this));
    this.bot.on('urlbot_on_save', this.onSave.bind(this));
    this.bot.on('urlbot_on_save_user_input', this.onSaveUserInput.bind(this));
    this.bot.on(
      'urlbot_on_delete_user_input',
      this.onDeleteUserInput.bind(this),
    );
    this.bot.on('urlbot_on_find_user_input', this.onFindUserInput.bind(this));
  }

  /**
   * Start command
   * @param chatId
   */
  async onStart(messageData: IMessageData): Promise<void> {
    await this.startAction.exec(messageData);
  }

  /**
   * Help command
   * @param chatId
   */
  async onHelp(messageData: IMessageData): Promise<void> {
    await this.helpAction.exec(messageData);
  }

  /**
   * On list callback
   * @param chatId
   */
  async onList(messageData: IMessageData) {
    await this.listAction.exec(messageData);
  }

  /**
   * On find callback
   * @param chatId
   */
  async onFind(messageData: IMessageData) {
    await this.findAction.exec(messageData);
  }

  /**
   * On save callback
   * @param chatId
   */
  async onSave(messageData: IMessageData) {
    await this.saveAction.exec(messageData);
  }

  /**
   * On delete callback
   * @param chatId
   */
  async onDelete(messageData: IMessageData) {
    await this.deleteAction.exec(messageData);
  }

  /**
   * On find callback
   * @param chatId
   */
  async onFindUserInput(messageData: IMessageData) {
    await this.findUserInputAction.exec(messageData);
  }

  /**
   * On save callback
   * @param chatId
   */
  async onSaveUserInput(messageData: IMessageData) {
    await this.saveUserInputAction.exec(messageData);
  }

  /**
   * On delete callback
   * @param chatId
   */
  async onDeleteUserInput(messageData: IMessageData) {
    await this.deleteUserInputAction.exec(messageData);
  }
}
