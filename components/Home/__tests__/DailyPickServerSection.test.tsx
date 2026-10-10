import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyPickServerSection from '../DailyPickServerSection';
import { generateText } from 'ai';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { render } from '@testing-library/react';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authOptions', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    dailyPick: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    movie: { findMany: vi.fn() },
    show: { findMany: vi.fn() },
    game: { findMany: vi.fn() },
  },
}));

vi.mock('@ai-sdk/groq', () => ({
  createGroq: vi.fn(() => vi.fn()),
}));

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

// Mock DailyPickCard so we don't need to mount real client components
vi.mock('../DailyPickCard', () => ({
  default: ({ pick }: any) => <div data-testid='daily-pick-card'>{pick.pitch}</div>,
}));

describe('DailyPickServerSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  it('handles empty string response from Groq by retrying', async () => {
    // Setup mock user
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user1' } } as any);

    // Mock Prisma to return no existing pick, but some PTW items
    vi.mocked(prisma.dailyPick.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.movie.findMany).mockResolvedValue([
      { id: 1, name: 'PTW Movie', status: 'PLAN_TO_WATCH' },
    ] as any);
    vi.mocked(prisma.show.findMany).mockResolvedValue([]);
    vi.mocked(prisma.game.findMany).mockResolvedValue([]);

    // Mock generateText to return empty string first, then valid JSON on retry
    vi.mocked(generateText)
      .mockResolvedValueOnce({ text: '' } as any)
      .mockResolvedValueOnce({ text: '' } as any)
      .mockResolvedValueOnce({
        text: '```json\n{"id": "1", "type": "MOVIE", "pitch": "You will love this movie!"}\n```',
      } as any);

    // Mock successful save
    vi.mocked(prisma.dailyPick.create).mockResolvedValue({
      id: 'pick1',
      pitch: 'You will love this movie!',
    } as any);

    // Render the server component
    const ServerComponent = await DailyPickServerSection();
    const { getByTestId } = render(ServerComponent as React.ReactElement);

    // Verify
    expect(getByTestId('daily-pick-card')).toHaveTextContent('You will love this movie!');
    expect(generateText).toHaveBeenCalledTimes(3); // 2 empty string failures, 1 success
  });

  it('renders error if Groq constantly returns empty string', async () => {
    // Setup mock user
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user1' } } as any);

    // Mock Prisma to return no existing pick, but some PTW items
    vi.mocked(prisma.dailyPick.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.movie.findMany).mockResolvedValue([
      { id: 1, name: 'PTW Movie', status: 'PLAN_TO_WATCH' },
    ] as any);
    vi.mocked(prisma.show.findMany).mockResolvedValue([]);
    vi.mocked(prisma.game.findMany).mockResolvedValue([]);

    // Mock generateText to always return empty string
    vi.mocked(generateText).mockResolvedValue({ text: '' } as any);

    // Render the server component
    const ServerComponent = await DailyPickServerSection();
    const { getByText } = render(ServerComponent as React.ReactElement);

    // Verify it exhausted 4 retries
    expect(generateText).toHaveBeenCalledTimes(4);
    expect(
      getByText(/Error generating daily pick: AI returned an invalid response format/i)
    ).toBeInTheDocument();
  });
});
