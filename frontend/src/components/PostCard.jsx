const typeLabels = {
  general: '💬 Post',
  report: '🚨 Issue Report',
  tree: '🌳 Tree Planted',
};

export default function PostCard({ post }) {
  const timeAgo = new Date(post.createdAt).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-author">
          <div className="avatar">{post.author?.username?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <strong>{post.author?.username}</strong>
            <span className="post-location">📍 {post.location}</span>
          </div>
        </div>
        <span className={`post-type type-${post.type}`}>{typeLabels[post.type] || 'Post'}</span>
      </header>

      <p className="post-content">{post.content}</p>

      {post.image && (
        <img src={post.image} alt="Post attachment" className="post-image" />
      )}

      <footer className="post-footer">
        <time>{timeAgo}</time>
        {post.author?.badges?.length > 0 && (
          <div className="badges">
            {post.author.badges.map((b) => (
              <span key={b} className="badge">{b}</span>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
