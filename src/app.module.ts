import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BotModule } from './modules/bot/bot.module';
import { UserSessionModule } from './modules/user-session/user-session.module';

@Module({
  imports: [
    UserSessionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
