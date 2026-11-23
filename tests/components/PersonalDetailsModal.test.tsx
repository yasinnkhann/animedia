import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalDetailsModal from '@/components/MyMedia/PersonalDetailsModal';

const mockUpdateMediaPersonalDetails = vi.fn();

vi.mock('@/app/actions/media', () => ({
  updateMediaPersonalDetails: (...args: any[]) => mockUpdateMediaPersonalDetails(...args),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('PersonalDetailsModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    mediaType: 'SHOW' as const,
    mediaId: '49157',
    mediaTitle: 'Houdini',
    initialNotes: 'Great miniseries about the famous illusionist.',
    initialTags: ['historical', 'drama'],
    initialRewatchCount: 1,
    onSaveSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateMediaPersonalDetails.mockResolvedValue({ success: true });
  });

  it('does not render when isOpen is false', () => {
    render(<PersonalDetailsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with title, mediaTitle, initial values, and action buttons', () => {
    render(<PersonalDetailsModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Personal Log & Notes')).toBeInTheDocument();
    expect(screen.getByText('Houdini')).toBeInTheDocument();
    expect(screen.getByText('Times Rewatched')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('#historical')).toBeInTheDocument();
    expect(screen.getByText('#drama')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Great miniseries about the famous illusionist.')
    ).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders "Times Replayed" for GAME media type', () => {
    render(<PersonalDetailsModal {...defaultProps} mediaType='GAME' />);
    expect(screen.getByText('Times Replayed')).toBeInTheDocument();
  });

  it('increments and decrements the rewatch counter', () => {
    render(<PersonalDetailsModal {...defaultProps} initialRewatchCount={2} />);

    const decBtn = screen.getByLabelText('Decrease count');
    const incBtn = screen.getByLabelText('Increase count');

    fireEvent.click(incBtn);
    expect(screen.getByText('3')).toBeInTheDocument();

    fireEvent.click(decBtn);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decBtn);
    fireEvent.click(decBtn);
    expect(screen.getByText('0')).toBeInTheDocument();

    // Decrement button should now be disabled at 0
    expect(decBtn).toBeDisabled();
  });

  it('allows adding and removing custom tags', () => {
    render(<PersonalDetailsModal {...defaultProps} initialTags={['favorite']} />);

    expect(screen.getByText('#favorite')).toBeInTheDocument();

    // Add tag via input
    const input = screen.getByPlaceholderText('Add a tag (e.g. cozy, masterpiece)...');
    fireEvent.change(input, { target: { value: 'masterpiece' } });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('#masterpiece')).toBeInTheDocument();

    // Remove tag
    const removeBtn = screen.getByLabelText('Remove tag favorite');
    fireEvent.click(removeBtn);

    expect(screen.queryByText('#favorite')).not.toBeInTheDocument();
    expect(screen.getByText('#masterpiece')).toBeInTheDocument();
  });

  it('adds tags via tag suggestions', () => {
    render(<PersonalDetailsModal {...defaultProps} initialTags={[]} />);

    const suggestionBtn = screen.getByText('+mind-bending');
    fireEvent.click(suggestionBtn);

    expect(screen.getByText('#mind-bending')).toBeInTheDocument();
  });

  it('calls onClose when close button, cancel button, or Escape key is pressed', () => {
    render(<PersonalDetailsModal {...defaultProps} />);

    // Close button
    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);

    // Cancel button
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(3);
  });

  it('calls updateMediaPersonalDetails and onSaveSuccess when Save Changes is clicked', async () => {
    render(<PersonalDetailsModal {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(
      'Add private notes, memories, watch parties, gameplay impressions...'
    );
    fireEvent.change(textarea, { target: { value: 'Updated note here' } });

    const saveBtn = screen.getByText('Save Changes');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateMediaPersonalDetails).toHaveBeenCalledWith('49157', 'SHOW', {
        notes: 'Updated note here',
        tags: ['historical', 'drama'],
        rewatchCount: 1,
      });
    });

    expect(defaultProps.onSaveSuccess).toHaveBeenCalledWith({
      notes: 'Updated note here',
      tags: ['historical', 'drama'],
      rewatchCount: 1,
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
