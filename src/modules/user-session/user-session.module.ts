import { Module } from '@nestjs/common';
import { UserSessionService } from './services/user-session/user-session.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [UserSessionService],
  exports: [CacheModule, UserSessionService],
})
export class UserSessionModule {}
