import { render, screen } from '@testing-library/react';
import { WordCounter } from '../word-counter';

describe('WordCounter', () => {
  it('should display current and min-max word count', () => {
    render(<WordCounter current={50} min={100} max={200} />);

    // Look for the complete string format
    expect(screen.getByText(/50 \/ 100-200/)).toBeInTheDocument();
  });

  it('should show default label "Words"', () => {
    render(<WordCounter current={50} min={100} max={200} />);

    expect(screen.getByText('Words')).toBeInTheDocument();
  });

  it('should show custom label when provided', () => {
    render(<WordCounter current={50} min={100} max={200} label="Section Words" />);

    expect(screen.getByText('Section Words')).toBeInTheDocument();
  });

  it('should show amber color when under min', () => {
    render(<WordCounter current={50} min={100} max={200} />);

    // Should show "Add X more words" message
    expect(screen.getByText(/Add 50 more words/i)).toBeInTheDocument();
  });

  it('should show red color when over max', () => {
    render(<WordCounter current={250} min={100} max={200} />);

    // Should show "Remove X words" message
    expect(screen.getByText(/Remove 50 words/i)).toBeInTheDocument();
  });

  it('should show green color when in range', () => {
    render(<WordCounter current={150} min={100} max={200} />);

    // Should not show any warning messages
    expect(screen.queryByText(/Add/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove/i)).not.toBeInTheDocument();
  });

  it('should handle zero current count', () => {
    render(<WordCounter current={0} min={100} max={200} />);

    expect(screen.getByText(/0 \/ 100-200/)).toBeInTheDocument();
    expect(screen.getByText(/Add 100 more words/i)).toBeInTheDocument();
  });

  it('should handle edge case at min boundary', () => {
    render(<WordCounter current={100} min={100} max={200} />);

    // Exactly at min should be in range (green)
    expect(screen.queryByText(/Add/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove/i)).not.toBeInTheDocument();
  });

  it('should handle edge case at max boundary', () => {
    render(<WordCounter current={200} min={100} max={200} />);

    // Exactly at max should be in range (green)
    expect(screen.queryByText(/Add/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove/i)).not.toBeInTheDocument();
  });
});
