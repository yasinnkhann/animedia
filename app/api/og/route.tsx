import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'AniMedia';
    const poster = searchParams.get('poster');
    const rating = searchParams.get('rating');
    const type = searchParams.get('type') || 'MEDIA';

    // To prevent extremely long titles breaking the layout
    const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#0f172a', // slate-900 background
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
            color: 'white',
            padding: '40px 60px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Poster Image Container */}
          <div
            style={{
              display: 'flex',
              width: '380px',
              height: '550px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              backgroundColor: '#1e293b',
              flexShrink: 0,
            }}
          >
            {poster ? (
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
                  fontSize: '48px',
                  color: '#64748b',
                }}
              >
                ?
              </div>
            )}
          </div>

          {/* Right Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: '60px',
              flex: 1,
            }}
          >
            {/* Type Badge */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500/20
                color: '#60a5fa', // blue-400
                padding: '8px 24px',
                borderRadius: '9999px',
                fontSize: '24px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '24px',
                width: 'fit-content',
              }}
            >
              {type}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '40px',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {truncatedTitle}
            </div>

            {/* Rating */}
            {rating && rating !== '0' && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#3b82f6', // blue-500
                    borderRadius: '50%',
                    width: '90px',
                    height: '90px',
                    fontSize: '36px',
                    fontWeight: 800,
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  {rating}%
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '20px',
                  }}
                >
                  <span style={{ fontSize: '28px', color: '#cbd5e1', fontWeight: 600 }}>
                    Community Rating
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Watermark / Logo */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '4px',
              color: '#3b82f6',
            }}
          >
            ANIMEDIA
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response('Failed to generate image', { status: 500 });
  }
}
