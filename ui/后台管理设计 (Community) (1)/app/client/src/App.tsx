import { useState, useEffect, useCallback } from 'react';
import { octokit, githubConfig } from './config';

// ---- 类型定义 ----
type IssueState = 'open' | 'closed' | 'all';

interface GithubLabel {
  name: string;
  color: string;
}

interface GithubUser {
  login: string;
  avatar_url: string;
}

interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  body: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: GithubLabel[];
  user: GithubUser | null;
  comments: number;
}

// ---- 是否已完成配置 ----
const isConfigured =
  githubConfig.auth !== 'your_github_personal_access_token_here' &&
  githubConfig.owner !== 'your_github_username' &&
  githubConfig.repo !== 'your_repo_name';

// ---- 颜色辅助 ----
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState<IssueState>('open');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchIssues = useCallback(
    async (currentPage = 1) => {
      if (!isConfigured) return;
      setLoading(true);
      setError('');
      try {
        const res = await octokit.rest.issues.listForRepo({
          owner: githubConfig.owner,
          repo: githubConfig.repo,
          state: filterState,
          per_page: 30,
          page: currentPage,
          sort: 'updated',
          direction: 'desc',
        });

        const data = res.data as Issue[];
        if (currentPage === 1) {
          setIssues(data);
        } else {
          setIssues((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 30);
        setPage(currentPage);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '请求失败';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [filterState],
  );

  useEffect(() => {
    fetchIssues(1);
  }, [fetchIssues]);

  const toggleState = async (issue: Issue) => {
    setUpdatingId(issue.number);
    try {
      const newState = issue.state === 'open' ? 'closed' : 'open';
      await octokit.rest.issues.update({
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        issue_number: issue.number,
        state: newState,
      });
      // 更新本地状态，避免重新全量请求
      setIssues((prev) =>
        filterState === 'all'
          ? prev.map((i) => (i.number === issue.number ? { ...i, state: newState } : i))
          : prev.filter((i) => i.number !== issue.number),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '更新失败');
    } finally {
      setUpdatingId(null);
    }
  };

  // ---- 样式常量 ----
  const s = {
    page: {
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: '24px 16px',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    } as React.CSSProperties,
    container: { maxWidth: 860, margin: '0 auto' } as React.CSSProperties,
    header: { marginBottom: 24 } as React.CSSProperties,
    h1: { fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 } as React.CSSProperties,
    subtitle: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' } as React.CSSProperties,
    banner: (color: string): React.CSSProperties => ({
      background: color === 'yellow' ? '#fef3c7' : '#fee2e2',
      border: `1px solid ${color === 'yellow' ? '#f59e0b' : '#f87171'}`,
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 16,
      fontSize: 13,
      color: color === 'yellow' ? '#92400e' : '#991b1b',
      lineHeight: 1.6,
    }),
    toolbar: {
      display: 'flex',
      gap: 8,
      marginBottom: 16,
      alignItems: 'center',
      flexWrap: 'wrap',
    } as React.CSSProperties,
    filterBtn: (active: boolean): React.CSSProperties => ({
      padding: '6px 16px',
      borderRadius: 20,
      border: '1px solid',
      borderColor: active ? '#2563eb' : '#d1d5db',
      background: active ? '#2563eb' : '#fff',
      color: active ? '#fff' : '#374151',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s',
    }),
    refreshBtn: {
      marginLeft: 'auto',
      padding: '6px 16px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      background: '#fff',
      cursor: 'pointer',
      fontSize: 13,
      color: '#374151',
    } as React.CSSProperties,
    count: { fontSize: 13, color: '#9ca3af', marginBottom: 10 } as React.CSSProperties,
    list: { display: 'flex', flexDirection: 'column', gap: 8 } as React.CSSProperties,
    card: {
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '14px 16px',
      background: '#fff',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'box-shadow 0.15s',
    } as React.CSSProperties,
    stateIcon: { paddingTop: 2, fontSize: 15, flexShrink: 0 } as React.CSSProperties,
    content: { flex: 1, minWidth: 0 } as React.CSSProperties,
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    } as React.CSSProperties,
    issueLink: {
      fontWeight: 600,
      color: '#111827',
      textDecoration: 'none',
      fontSize: 15,
      lineHeight: 1.4,
    } as React.CSSProperties,
    issueNum: { fontSize: 12, color: '#9ca3af', flexShrink: 0 } as React.CSSProperties,
    meta: { margin: '4px 0 0', fontSize: 12, color: '#9ca3af' } as React.CSSProperties,
    actionBtn: (isOpen: boolean): React.CSSProperties => ({
      padding: '5px 12px',
      borderRadius: 6,
      border: '1px solid',
      borderColor: isOpen ? '#f87171' : '#4ade80',
      color: isOpen ? '#dc2626' : '#16a34a',
      background: '#fff',
      cursor: 'pointer',
      fontSize: 12,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontWeight: 500,
    }),
    empty: { textAlign: 'center', padding: '48px 0', color: '#9ca3af' } as React.CSSProperties,
    loadMore: {
      display: 'block',
      width: '100%',
      marginTop: 12,
      padding: '10px',
      borderRadius: 8,
      border: '1px solid #d1d5db',
      background: '#fff',
      cursor: 'pointer',
      fontSize: 13,
      color: '#374151',
      textAlign: 'center',
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.h1}>GitHub Issues 管理</h1>
          <p style={s.subtitle}>
            {isConfigured
              ? `${githubConfig.owner} / ${githubConfig.repo}`
              : '尚未配置 GitHub 仓库'}
          </p>
        </div>

        {/* 未配置提示 */}
        {!isConfigured && (
          <div style={s.banner('yellow')}>
            ⚠️ 请先编辑{' '}
            <code
              style={{ background: '#fde68a', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}
            >
              client/src/config.ts
            </code>
            ，填写你的 GitHub Token、owner 和 repo，保存后刷新页面。
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div style={s.banner('red')}>
            ❌ {error}
          </div>
        )}

        {/* 过滤栏 */}
        <div style={s.toolbar}>
          {(['open', 'closed', 'all'] as IssueState[]).map((st) => (
            <button
              key={st}
              style={s.filterBtn(filterState === st)}
              onClick={() => setFilterState(st)}
            >
              {st === 'open' ? '🟢 开启中' : st === 'closed' ? '🔴 已关闭' : '📋 全部'}
            </button>
          ))}
          <button
            style={s.refreshBtn}
            onClick={() => fetchIssues(1)}
            disabled={loading || !isConfigured}
          >
            {loading ? '加载中…' : '🔄 刷新'}
          </button>
        </div>

        {/* Issue 数量 */}
        {!loading && issues.length > 0 && (
          <p style={s.count}>共显示 {issues.length} 条</p>
        )}

        {/* Issue 列表 */}
        <div style={s.list}>
          {!loading && issues.length === 0 && isConfigured && (
            <div style={s.empty}>暂无 Issue</div>
          )}

          {issues.map((issue) => (
            <div key={issue.id} style={s.card}>
              {/* 状态图标 */}
              <div style={s.stateIcon}>
                {issue.state === 'open' ? '🟢' : '🔴'}
              </div>

              {/* 内容区 */}
              <div style={s.content}>
                <div style={s.titleRow}>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={s.issueLink}
                  >
                    {issue.title}
                  </a>
                  <span style={s.issueNum}>#{issue.number}</span>

                  {/* Labels */}
                  {issue.labels.map((label) => (
                    <span
                      key={label.name}
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: `rgba(${hexToRgb(label.color)}, 0.15)`,
                        color: `#${label.color}`,
                        border: `1px solid rgba(${hexToRgb(label.color)}, 0.4)`,
                        fontWeight: 500,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>

                <p style={s.meta}>
                  由 <strong>{issue.user?.login}</strong> 创建于{' '}
                  {new Date(issue.created_at).toLocaleDateString('zh-CN')}
                  {issue.comments > 0 && `　💬 ${issue.comments} 条评论`}
                </p>
              </div>

              {/* 状态切换按钮 */}
              <button
                style={s.actionBtn(issue.state === 'open')}
                onClick={() => toggleState(issue)}
                disabled={updatingId === issue.number}
              >
                {updatingId === issue.number
                  ? '处理中…'
                  : issue.state === 'open'
                    ? '关闭'
                    : '重新打开'}
              </button>
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        {hasMore && !loading && (
          <button style={s.loadMore} onClick={() => fetchIssues(page + 1)}>
            加载更多
          </button>
        )}

        {loading && issues.length > 0 && (
          <p style={{ ...s.empty, padding: '16px 0' }}>加载中…</p>
        )}
      </div>
    </div>
  );
}
