import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { articleService } from '../services/article.service.js';
import { ArticleStatus, Role } from '../generated/prisma/index.js';

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await articleService.createArticle(req.body, req.user.id);
  res.status(201).json(ApiResponse.success('Article created successfully', article));
});

export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await articleService.updateArticle(id, req.body);
  res.status(200).json(ApiResponse.success('Article updated successfully', article));
});

export const publishArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await articleService.publishArticle(id);
  res.status(200).json(ApiResponse.success('Article published successfully', article));
});

export const archiveArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const article = await articleService.archiveArticle(id);
  res.status(200).json(ApiResponse.success('Article archived successfully', article));
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await articleService.deleteArticle(id);
  res.status(200).json(ApiResponse.success('Article deleted successfully'));
});

export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === Role.ADMIN;
  
  const options = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    status: req.query.status as ArticleStatus | undefined,
    search: req.query.search as string | undefined,
    tag: req.query.tag as string | undefined,
    isAdmin,
  };

  const result = await articleService.getArticles(options);
  res.status(200).json(ApiResponse.success('Articles retrieved successfully', result));
});

export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const isAdmin = req.user?.role === Role.ADMIN;
  
  const article = await articleService.getArticleBySlug(slug, isAdmin);
  res.status(200).json(ApiResponse.success('Article retrieved successfully', article));
});
