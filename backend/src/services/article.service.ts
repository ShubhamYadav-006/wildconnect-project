import { ArticleStatus } from '../generated/prisma/index.js';
import { articleRepository } from '../repositories/article.repository.js';
import { destinationRepository } from '../repositories/destination.repository.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import crypto from 'crypto';

export class ArticleService {
  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const existing = await articleRepository.findBySlug(slug);
      if (!existing || (excludeId && existing.id === excludeId)) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return slug;
  }

  async createArticle(data: any, authorId: string) {
    if (data.destinationId) {
      const destination = await destinationRepository.findById(data.destinationId);
      if (!destination) {
        throw new NotFoundError('Destination not found');
      }
    }

    const slug = await this.generateUniqueSlug(data.title);
    return articleRepository.create({
      ...data,
      slug,
      authorId,
      status: ArticleStatus.DRAFT,
    });
  }

  async updateArticle(id: string, data: any) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Article not found');
    }

    if (data.destinationId) {
      const destination = await destinationRepository.findById(data.destinationId);
      if (!destination) {
        throw new NotFoundError('Destination not found');
      }
    }

    let updateData = { ...data };

    if (data.title && data.title !== existing.title) {
      updateData.slug = await this.generateUniqueSlug(data.title, id);
    }

    return articleRepository.update(id, updateData);
  }

  async publishArticle(id: string) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Article not found');
    }

    if (existing.status === ArticleStatus.PUBLISHED) {
      throw new BadRequestError('Article is already published');
    }

    return articleRepository.update(id, { status: ArticleStatus.PUBLISHED });
  }

  async archiveArticle(id: string) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Article not found');
    }

    if (existing.status === ArticleStatus.ARCHIVED) {
      throw new BadRequestError('Article is already archived');
    }

    return articleRepository.update(id, { status: ArticleStatus.ARCHIVED });
  }

  async deleteArticle(id: string) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Article not found');
    }

    await articleRepository.softDelete(id);
  }

  async getArticles(options: {
    page?: number;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
    tag?: string;
    isAdmin?: boolean;
  }) {
    let queryOptions = { ...options };

    // If not admin, force status to PUBLISHED
    if (!options.isAdmin) {
      queryOptions.status = ArticleStatus.PUBLISHED;
    }

    return articleRepository.findAll(queryOptions);
  }

  async getArticleBySlug(slug: string, isAdmin: boolean = false) {
    const article = await articleRepository.findBySlug(slug);

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (!isAdmin && article.status !== ArticleStatus.PUBLISHED) {
      throw new NotFoundError('Article not found'); // Do not expose draft/archived
    }

    return article;
  }
}

export const articleService = new ArticleService();
