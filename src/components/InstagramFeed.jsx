import React, { useEffect, useState } from 'react';

/**
 * Instagram feed strip — fetches recent posts via the Instagram Graph API.
 *
 * Setup required (one-time, by the page owner):
 *  1. Connect Instagram Professional account to a Facebook Page
 *  2. Create a Meta App at developers.facebook.com
 *  3. Add Instagram Graph API product → get a long-lived token
 *  4. Set VITE_INSTAGRAM_TOKEN=<token> in your .env file
 *  5. The token lasts 60 days — refresh it via the token refresh endpoint
 *
 * When the token is not set, this component renders nothing (invisible).
 */

const TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN;
const IG_HANDLE = 'serenest.fit';
const FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
const LIMIT = 9;

export default function InstagramFeed() {
  const [posts, setPosts]   = useState([]);
  const [error, setError]   = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!TOKEN) return;
    fetch(
      `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${TOKEN}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setPosts(data.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoaded(true));
  }, []);

  if (!TOKEN || error || (loaded && posts.length === 0)) return null;

  return (
    <section className="ig-feed-section">
      <div className="container">
        <div className="ig-feed-head">
          <a
            className="ig-handle"
            href="https://www.instagram.com/serenest.fit"
            target="_blank"
            rel="noreferrer"
            aria-label="Follow @serenest.fit on Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4.5"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
            @{IG_HANDLE}
          </a>
          <p className="ig-feed-sub">Follow us for daily mental health insights</p>
        </div>

        <div className="ig-grid">
          {posts.map((post) => {
            const thumb = post.media_type === 'VIDEO'
              ? post.thumbnail_url
              : post.media_url;
            const caption = post.caption ? post.caption.slice(0, 90) + (post.caption.length > 90 ? '…' : '') : '';
            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="ig-cell"
                aria-label={caption || 'Instagram post'}
              >
                <img src={thumb} alt={caption} loading="lazy" className="ig-img" />
                <div className="ig-overlay">
                  <p className="ig-caption">{caption}</p>
                </div>
                {post.media_type === 'VIDEO' && (
                  <span className="ig-video-badge" aria-hidden="true">▶</span>
                )}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <span className="ig-carousel-badge" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="15" height="14" rx="2"/><rect x="6" y="3" width="15" height="14" rx="2" opacity=".4"/></svg>
                  </span>
                )}
              </a>
            );
          })}
        </div>

        <div className="ig-feed-more">
          <a
            className="btn btn-ghost"
            href="https://www.instagram.com/serenest.fit"
            target="_blank"
            rel="noreferrer"
          >
            See all posts on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
