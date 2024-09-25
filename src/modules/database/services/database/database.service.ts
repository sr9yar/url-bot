import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link, LinkDocument } from '../../schemas/link.schema';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';

/**
 * A service for interration with the persistent storage
 */
@Injectable()
export class DatabaseService {
  // Logger
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectModel(Link.name) private linkModel: Model<LinkDocument>) {}

  /**
   * Received a link record by short code
   * @param shortCode
   * @returns
   */
  async getLinkByShortCode(shortCode: string): Promise<LinkDocument> {
    const trimmedShortCode = shortCode.trim();

    if (!trimmedShortCode) {
      throw new Error('shortCode parameter cannot be empty.');
    }

    const link: LinkDocument = await this.linkModel
      .findOne({
        shortCode: trimmedShortCode.trim(),
      })
      .exec();

    return link;
  }

  /**
   * Save a new url to the databse
   * @param url
   * @param chatId
   * @returns
   */
  async saveUrl(url: string, chatId: number): Promise<LinkDocument> {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      throw new Error('url parameter cannot be empty.');
    }

    if (!isURL(trimmedUrl)) {
      throw new Error('url parameter is not valid.');
    }

    let shortCode = nanoid(8);

    while (!(await this.isShortCodeUnique(shortCode))) {
      shortCode = nanoid(8);
    }

    const link: LinkDocument = await this.linkModel.create({
      shortCode,
      url,
      chatId,
    });

    return link;
  }

  /**
   * Check if a code is unique as low probability of collisions still exists
   * @param shortCode
   * @returns
   */
  private async isShortCodeUnique(shortCode: string): Promise<boolean> {
    const trimmedShortCode = shortCode.trim();

    if (!trimmedShortCode) {
      throw new Error('shortCode parameter cannot be empty.');
    }

    const count: number = await this.linkModel
      .countDocuments({
        shortCode: trimmedShortCode,
      })
      .exec();

    return !count;
  }

  /**
   * Return all links for a given chat
   * @param chatId number
   * @returns
   */
  async getAllLinks(chatId: number): Promise<LinkDocument[]> {
    const links: LinkDocument[] = await this.linkModel
      .find({
        chatId,
      })
      .exec();

    return links;
  }

  /**
   * Delete a link for a given chat
   * @param shortCode string
   * @param chatId string
   * @returns
   */
  async deleteLink(shortCode: string, chatId: number): Promise<LinkDocument> {
    const trimmedShortCode = shortCode.trim();

    if (!trimmedShortCode) {
      throw new Error('shortCode parameter cannot be empty.');
    }

    const link: LinkDocument = await this.linkModel
      .findOneAndDelete({
        chatId,
        shortCode,
      })
      .exec();

    return link;
  }
}
