import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * A service for storing user chat session data
 */
@Injectable()
export class UserSessionService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Gets the last requested command
   * @param chatId
   * @returns
   */
  async getLastCommand(chatId: number): Promise<string> {
    if (!chatId) {
      return null;
    }
    const value = await this.cacheManager.get(chatId.toString());
    if (!value) {
      return null;
    }
    return `${value}`;
  }

  /**
   * Sets the last requested command
   * @param chatId
   * @returns
   */
  async setLastCommand(chatId: number, command: string): Promise<void> {
    if (!chatId) {
      return;
    }
    await this.cacheManager.set(`${chatId}`, command, 0);
  }

  /**
   * Removes the last requested command
   * @param chatId
   * @returns
   */
  async resetLastCommand(chatId: number): Promise<void> {
    if (!chatId) {
      return;
    }
    await this.cacheManager.del(`${chatId}`);
  }
}
