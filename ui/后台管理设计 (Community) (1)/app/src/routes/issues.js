import { Router } from 'express';
import { Octokit } from '@octokit/rest';
import { config } from '../config.js';

const router = Router();

// 每次请求都用最新配置初始化，方便热更新 .env 后无需重启
function getOctokit() {
  return new Octokit({ auth: config.token });
}

/**
 * 获取 Issues 列表
 * GET /api/issues
 * Query: state=open|closed|all, per_page=30, page=1, labels=bug,enhancement, sort=created|updated, direction=asc|desc
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      state = 'open',
      per_page = 30,
      page = 1,
      labels,
      sort = 'created',
      direction = 'desc',
    } = req.query;

    const response = await getOctokit().rest.issues.listForRepo({
      owner: config.owner,
      repo: config.repo,
      state,
      per_page: Number(per_page),
      page: Number(page),
      sort,
      direction,
      ...(labels && { labels }),
    });

    res.json({
      data: response.data,
      pagination: {
        page: Number(page),
        per_page: Number(per_page),
        link: response.headers.link || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 获取 Label 列表（放在 /:number 路由之前避免被捕获）
 * GET /api/issues/meta/labels
 */
router.get('/meta/labels', async (req, res, next) => {
  try {
    const response = await getOctokit().rest.issues.listLabelsForRepo({
      owner: config.owner,
      repo: config.repo,
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 获取单个 Issue
 * GET /api/issues/:number
 */
router.get('/:number', async (req, res, next) => {
  try {
    const response = await getOctokit().rest.issues.get({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 更新 Issue（标题、内容、状态、标签、指派人）
 * PATCH /api/issues/:number
 * Body: { state?: 'open'|'closed', title?: string, body?: string, labels?: string[], assignees?: string[] }
 */
router.patch('/:number', async (req, res, next) => {
  try {
    const { state, title, body, labels, assignees } = req.body;

    const payload = {};
    if (state !== undefined) payload.state = state;
    if (title !== undefined) payload.title = title;
    if (body !== undefined) payload.body = body;
    if (labels !== undefined) payload.labels = labels;
    if (assignees !== undefined) payload.assignees = assignees;

    const response = await getOctokit().rest.issues.update({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
      ...payload,
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 关闭 Issue（快捷接口）
 * POST /api/issues/:number/close
 */
router.post('/:number/close', async (req, res, next) => {
  try {
    const response = await getOctokit().rest.issues.update({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
      state: 'closed',
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 重新打开 Issue（快捷接口）
 * POST /api/issues/:number/reopen
 */
router.post('/:number/reopen', async (req, res, next) => {
  try {
    const response = await getOctokit().rest.issues.update({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
      state: 'open',
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 获取 Issue 评论列表
 * GET /api/issues/:number/comments
 */
router.get('/:number/comments', async (req, res, next) => {
  try {
    const response = await getOctokit().rest.issues.listComments({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
    });
    res.json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

/**
 * 添加评论
 * POST /api/issues/:number/comments
 * Body: { body: string }
 */
router.post('/:number/comments', async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ error: 'body 不能为空' });
    }

    const response = await getOctokit().rest.issues.createComment({
      owner: config.owner,
      repo: config.repo,
      issue_number: Number(req.params.number),
      body,
    });
    res.status(201).json({ data: response.data });
  } catch (err) {
    next(err);
  }
});

export default router;
