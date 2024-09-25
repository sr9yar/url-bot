import { Module } from '@nestjs/common';
import { BotService } from './services/bot/bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from '../database/schemas/link.schema';
import { DatabaseModule } from '../database/database.module';
import { UserSessionModule } from '../user-session/user-session.module';
import { urlBotProvider } from './url-bot/url-bot.provider';
import { StartAction } from './actions/start.action';
import { HelpAction } from './actions/help.action';
import { FindAction } from './actions/find.action';
import { ListAction } from './actions/list.action';
import { DeleteAction } from './actions/delete.action';
import { FindUserInputAction } from './actions/find-user-input.action';
import { DeleteUserInputAction } from './actions/delete-user-input.action';
import { SaveUserInputAction } from './actions/save-user-input.action';
import { SaveAction } from './actions/save.action';

@Module({
  imports: [
    UserSessionModule,
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    DatabaseModule,
  ],
  providers: [
    urlBotProvider,

    StartAction,
    HelpAction,
    FindAction,
    ListAction,
    DeleteAction,
    SaveAction,
    FindUserInputAction,
    DeleteUserInputAction,
    SaveUserInputAction,

    BotService,
  ],
  exports: [BotService],
})
export class BotModule {}
