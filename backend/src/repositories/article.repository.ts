import { prisma } from '../config/db.js';
import { Prisma, Article, ArticleStatus } from '../generated/prisma/index.js';

export class ArticleRepository {
  async create(data: Prisma.ArticleUncheckedCreateInput): Promise<Article> {
    return prisma.article.create({
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ArticleUncheckedUpdateInput): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findById(id: string): Promise<Article | null> {
    return prisma.article.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Article | null> {
    return prisma.article.findFirst({
      where: { slug, deletedAt: null },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
    tag?: string;
  }): Promise<{ data: Article[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, status, search, tag } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
          destination: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const articleRepository = new ArticleRepository();
