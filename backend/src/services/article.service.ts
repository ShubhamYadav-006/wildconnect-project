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
    const destinationId = data.destinationId && typeof data.destinationId === 'string' && data.destinationId.trim() !== ''
      ? data.destinationId.trim()
      : null;

    if (destinationId) {
      const destination = await destinationRepository.findById(destinationId);
      if (!destination) {
        throw new NotFoundError('Destination not found');
      }
    }

    const title = data.title.trim();
    const slug = await this.generateUniqueSlug(title);

    return articleRepository.create({
      title,
      content: data.content,
      featuredImage: data.featuredImage ? data.featuredImage.trim() : null,
      tags: Array.isArray(data.tags) ? data.tags.filter((t: any) => typeof t === 'string' && t.trim() !== '').map((t: string) => t.trim()) : [],
      destinationId: destinationId || undefined,
      slug,
      authorId,
      status: data.status === ArticleStatus.PUBLISHED ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
    });
  }

  async updateArticle(id: string, data: any) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Article not found');
    }

    const destinationId = data.destinationId !== undefined
      ? (data.destinationId && typeof data.destinationId === 'string' && data.destinationId.trim() !== '' ? data.destinationId.trim() : null)
      : undefined;

    if (destinationId) {
      const destination = await destinationRepository.findById(destinationId);
      if (!destination) {
        throw new NotFoundError('Destination not found');
      }
    }

    let updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.content !== undefined) updateData.content = data.content;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage ? data.featuredImage.trim() : null;
    if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags.filter((t: any) => typeof t === 'string' && t.trim() !== '').map((t: string) => t.trim()) : [];
    if (destinationId !== undefined) updateData.destinationId = destinationId;
    if (data.status !== undefined) updateData.status = data.status;

    if (data.title && data.title.trim() !== existing.title) {
      updateData.slug = await this.generateUniqueSlug(data.title.trim(), id);
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
