import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = (searchParams.get('type') || 'MEDIA').toUpperCase();
    const title = searchParams.get('title') || 'AniMedia';
    const poster = searchParams.get('poster');
    const backdrop = searchParams.get('backdrop');
    const rating = searchParams.get('rating'); // e.g. "82"
    const userRating = searchParams.get('userRating'); // e.g. "10"
    const rewatchCount = searchParams.get('rewatchCount'); // e.g. "2"
    const year = searchParams.get('year'); // e.g. "2024"
    const genres = searchParams.get('genres'); // e.g. "Sci-Fi • Action"
    const tagline = searchParams.get('tagline'); // e.g. "Your mind is the scene of the crime"

    // Profile-specific params
    const avatar = searchParams.get('avatar');
    const moviesCount = searchParams.get('movies') || '0';
    const showsCount = searchParams.get('shows') || '0';
    const gamesCount = searchParams.get('games') || '0';

    // Collection-specific params
    const curator = searchParams.get('curator');
    const itemCount = searchParams.get('itemCount');

    // Title truncation for safe rendering
    const truncatedTitle = title.length > 48 ? `${title.slice(0, 48)}...` : title;
    const truncatedTagline =
      tagline && tagline.length > 90 ? `${tagline.slice(0, 90)}...` : tagline;

    // Theme color based on media type
    const typeColors: Record<string, { bg: string; text: string; border: string }> = {
      MOVIE: { bg: 'rgba(0, 179, 255, 0.15)', text: '#38bdf8', border: 'rgba(0, 179, 255, 0.35)' },
      SHOW: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' },
      GAME: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)' },
      COLLECTION: {
        bg: 'rgba(245, 158, 11, 0.15)',
        text: '#fbbf24',
        border: 'rgba(245, 158, 11, 0.35)',
      },
      PROFILE: {
        bg: 'rgba(56, 189, 248, 0.15)',
        text: '#38bdf8',
        border: 'rgba(56, 189, 248, 0.35)',
      },
    };

    const activeColor = typeColors[type] || typeColors.MOVIE;

    // --- PROFILE CARD LAYOUT ---
    if (type === 'PROFILE') {
      const totalLogged = Number(moviesCount) + Number(showsCount) + Number(gamesCount);

      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#090d16',
              backgroundImage:
                'radial-gradient(circle at 15% 20%, #1e1b4b 0%, #090d16 65%, #020617 100%)',
              color: 'white',
              padding: '60px 70px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              position: 'relative',
            }}
          >
            {/* Top row: Avatar & Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '4px solid #00b3ff',
                  boxShadow: '0 0 35px rgba(0, 179, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1e293b',
                  flexShrink: 0,
                }}
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt='Avatar'
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px',
                      fontWeight: 800,
                      color: '#00b3ff',
                    }}
                  >
                    {title?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '36px',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'rgba(0, 179, 255, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(0, 179, 255, 0.35)',
                      padding: '6px 18px',
                      borderRadius: '9999px',
                      fontSize: '18px',
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                    }}
                  >
                    ANIMEDIA PROFILE
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '60px',
                    fontWeight: 900,
                    marginTop: '10px',
                    marginBottom: '4px',
                    color: '#ffffff',
                    lineHeight: 1.1,
                    display: 'flex',
                  }}
                >
                  {truncatedTitle}
                </div>

                <div style={{ fontSize: '24px', color: '#94a3b8', display: 'flex' }}>
                  Tracking Movies, TV Shows & Games
                </div>
              </div>
            </div>

            {/* Middle row: 4 Metric Cards */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Movies */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '24px 28px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 600 }}>🎬 Movies</div>
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 900,
                    color: '#38bdf8',
                    marginTop: '8px',
                    lineHeight: 1,
                  }}
                >
                  {moviesCount}
                </div>
              </div>

              {/* Shows */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '24px 28px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 600 }}>
                  📺 TV Shows
                </div>
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 900,
                    color: '#c084fc',
                    marginTop: '8px',
                    lineHeight: 1,
                  }}
                >
                  {showsCount}
                </div>
              </div>

              {/* Games */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '24px 28px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 600 }}>🎮 Games</div>
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 900,
                    color: '#34d399',
                    marginTop: '8px',
                    lineHeight: 1,
                  }}
                >
                  {gamesCount}
                </div>
              </div>

              {/* Total Logged */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '24px 28px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 600 }}>
                  ⭐ Total Logged
                </div>
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    marginTop: '8px',
                    lineHeight: 1,
                  }}
                >
                  {totalLogged}
                </div>
              </div>
            </div>

            {/* Bottom row: Watermark & Brand */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', color: '#64748b', fontWeight: 500 }}>
                  Join & track on animedia.app
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '28px',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  color: '#00b3ff',
                }}
              >
                ANIMEDIA
              </div>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // --- MEDIA CARD (MOVIE, SHOW, GAME, COLLECTION) LAYOUT ---
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#090d16',
            color: 'white',
            padding: '40px 56px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Backdrop Image with Cinematic Blur & Gradient Overlay */}
          {backdrop && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={backdrop}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35,
              }}
              alt='Backdrop'
            />
          )}

          {/* Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage:
                'linear-gradient(to right, rgba(9, 13, 22, 0.98) 0%, rgba(9, 13, 22, 0.92) 50%, rgba(9, 13, 22, 0.65) 100%)',
            }}
          />

          {/* Poster Container */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              width: '360px',
              height: '530px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.12)',
              backgroundColor: '#1e293b',
              flexShrink: 0,
            }}
          >
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt='Poster'
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px',
                  color: '#64748b',
                }}
              >
                🎬
              </div>
            )}
          </div>

          {/* Right Content */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: '52px',
              flex: 1,
            }}
          >
            {/* Top Badges: Type + Year + Genres */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: activeColor.bg,
                  color: activeColor.text,
                  border: `1px solid ${activeColor.border}`,
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                {type}
              </div>

              {year && (
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {year}
                </div>
              )}

              {genres && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: '19px',
                    color: '#94a3b8',
                    fontWeight: 500,
                    marginLeft: '4px',
                  }}
                >
                  {genres}
                </div>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: truncatedTitle.length > 30 ? '54px' : '66px',
                fontWeight: 900,
                lineHeight: 1.12,
                marginTop: '22px',
                marginBottom: '14px',
                color: '#ffffff',
                display: 'flex',
                letterSpacing: '-0.5px',
              }}
            >
              {truncatedTitle}
            </div>

            {/* Tagline / Curator line */}
            {type === 'COLLECTION' && curator && (
              <div
                style={{
                  fontSize: '22px',
                  color: '#fbbf24',
                  fontWeight: 600,
                  marginBottom: '16px',
                  display: 'flex',
                }}
              >
                Curated by {curator} • {itemCount || '0'} Items
              </div>
            )}

            {truncatedTagline && type !== 'COLLECTION' && (
              <div
                style={{
                  fontSize: '22px',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  marginBottom: '20px',
                  lineHeight: 1.3,
                  display: 'flex',
                }}
              >
                &ldquo;{truncatedTagline}&rdquo;
              </div>
            )}

            {/* Ratings & Personal Badges Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '12px',
                flexWrap: 'wrap',
              }}
            >
              {/* Community Rating */}
              {rating && rating !== '0' && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        Number(rating) >= 75
                          ? '#10b981'
                          : Number(rating) >= 60
                            ? '#00b3ff'
                            : '#f59e0b',
                      borderRadius: '50%',
                      width: '84px',
                      height: '84px',
                      fontSize: '32px',
                      fontWeight: 900,
                      boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.5)',
                      color: 'white',
                    }}
                  >
                    {rating}%
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '16px',
                    }}
                  >
                    <span style={{ fontSize: '22px', color: '#f1f5f9', fontWeight: 700 }}>
                      Community
                    </span>
                    <span style={{ fontSize: '18px', color: '#94a3b8' }}>Score</span>
                  </div>
                </div>
              )}

              {/* Personal User Rating Badge (if provided) */}
              {userRating && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '28px', color: '#fbbf24' }}>★</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#fbbf24' }}>
                      {userRating}/10
                    </span>
                    <span style={{ fontSize: '15px', color: '#cbd5e1' }}>User Rating</span>
                  </div>
                </div>
              )}

              {/* Rewatch Count Badge (if provided) */}
              {rewatchCount && Number(rewatchCount) > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>🔁</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#c084fc' }}>
                    Rewatched {Number(rewatchCount) + 1}x
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Brand Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '-28px',
                right: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  color: '#00b3ff',
                }}
              >
                ANIMEDIA
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e?.message || e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
