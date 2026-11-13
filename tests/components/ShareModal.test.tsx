import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareModal from '@/components/Media/ShareModal';

describe('ShareModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Inception',
    type: 'MOVIE' as const,
    ogImageUrl: '/api/og?type=MOVIE&title=Inception',
    url: 'https://animedia.app/movie/123-inception',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<ShareModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog and displays the social preview image', () => {
    render(<ShareModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Share Social Card')).toBeInTheDocument();

    const img = screen.getByAltText('Inception Social Preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/api/og?type=MOVIE&title=Inception');
  });

  it('copies link when Copy Link button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ShareModal {...defaultProps} />);
    const copyBtn = screen.getByText('Copy Link');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('https://animedia.app/movie/123-inception');
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('renders correct social share links', () => {
    render(<ShareModal {...defaultProps} />);

    const twitterLink = screen.getByTitle('Share on X');
    expect(twitterLink).toHaveAttribute(
      'href',
      expect.stringContaining('twitter.com/intent/tweet')
    );

    const whatsappLink = screen.getByTitle('Share on WhatsApp');
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('api.whatsapp.com/send'));

    const redditLink = screen.getByTitle('Share on Reddit');
    expect(redditLink).toHaveAttribute('href', expect.stringContaining('reddit.com/submit'));
  });

  it('closes on Escape key press', () => {
    render(<ShareModal {...defaultProps} />);
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders profile title appropriately for profile cards', () => {
    render(
      <ShareModal
        {...defaultProps}
        type='PROFILE'
        title='Yasin'
        ogImageUrl='/api/og?type=PROFILE&title=Yasin'
      />
    );
    expect(screen.getByText('Share Profile')).toBeInTheDocument();
  });

  it('calls onOpenRecommend when recommend button is clicked', () => {
    const onOpenRecommend = vi.fn();
    render(<ShareModal {...defaultProps} onOpenRecommend={onOpenRecommend} />);

    const recommendBtn = screen.getByText('Recommend directly to friends on AniMedia');
    fireEvent.click(recommendBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(onOpenRecommend).toHaveBeenCalled();
  });
});
