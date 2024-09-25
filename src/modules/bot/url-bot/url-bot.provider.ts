import { ConfigService } from '@nestjs/config';
import { UrlBot } from './url-bot.class';
import { URL_BOT } from './url-bot.token';
import { UserSessionService } from '../../user-session/services/user-session/user-session.service';

/**
 * Url bot provider
 */
export const urlBotProvider = {
  provide: URL_BOT,
  useFactory: async (
    configService: ConfigService,
    userSessionService: UserSessionService,
  ) => {
    const bot = new UrlBot(configService, userSessionService);
    await bot.init();
    return bot;
  },
  inject: [ConfigService, UserSessionService],
};
