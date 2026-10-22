import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InlineAddRow from './InlineAddRow';

const { mockSalads } = vi.hoisted(() => ({
  mockSalads: ['Caesar Salad', 'Greek Salad', 'Cobb Salad']
}));

vi.mock('../hooks/useSalads', () => ({
  default: () => mockSalads
}));

describe('InlineAddRow', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSalads.splice(0, mockSalads.length, 'Caesar Salad', 'Greek Salad', 'Cobb Salad');
  });

  it('should render form inputs', () => {
    render(<InlineAddRow onSave={mockOnSave} />);

    expect(screen.getByPlaceholderText('Item name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fresh Farm')).toBeInTheDocument();
    expect(screen.getByDisplayValue('No meal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Qty')).toBeInTheDocument();
  });

  it('should show No meal as the default meal link', () => {
    render(<InlineAddRow onSave={mockOnSave} />);

    const saladSelect = screen.getByDisplayValue('No meal');
    expect(saladSelect).toBeInTheDocument();
  });

  it('should include meal options from the menu when available', () => {
    render(<InlineAddRow onSave={mockOnSave} />);

    const saladSelect = screen.getByDisplayValue('No meal');
    
    expect(saladSelect).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('Cobb Salad')).toBeInTheDocument();
  });

  it('should explain the default list when no meals exist', () => {
    mockSalads.splice(0);
    render(<InlineAddRow onSave={mockOnSave} />);

    expect(screen.queryByLabelText('Meal (optional)')).not.toBeInTheDocument();
    expect(screen.getByText(/No meal links yet/)).toBeInTheDocument();
  });

  it('should call onSave with meal field when form is submitted', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const nameInput = screen.getByPlaceholderText('Item name');
    const saladSelect = screen.getByDisplayValue('No meal');

    await user.type(nameInput, 'Lettuce');
    await user.selectOptions(saladSelect, 'Caesar Salad');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Lettuce',
        store: 'Fresh Farm',
        salad: 'Caesar Salad',
        quantity: ''
      });
    });
  });

  it('should include salad in form data when submitting', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const nameInput = screen.getByPlaceholderText('Item name');
    const saladSelect = screen.getByDisplayValue('No meal');
    const quantityInput = screen.getByPlaceholderText('Qty');

    await user.type(nameInput, 'Tomatoes');
    await user.selectOptions(saladSelect, 'Greek Salad');
    await user.type(quantityInput, '2 lbs');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Tomatoes',
        store: 'Fresh Farm',
        salad: 'Greek Salad',
        quantity: '2 lbs'
      });
    });
  });

  it('should keep the selected meal link for adding related items', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const nameInput = screen.getByPlaceholderText('Item name');
    const saladSelect = screen.getByDisplayValue('No meal');

    await user.type(nameInput, 'Test Item');
    await user.selectOptions(saladSelect, 'Cobb Salad');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });

    // Keep the selected meal so related ingredients can be added quickly.
    await waitFor(() => {
      expect(screen.getByDisplayValue('Cobb Salad')).toBeInTheDocument();
    });
  });

  it('should reset all fields including meal link when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const nameInput = screen.getByPlaceholderText('Item name');
    const saladSelect = screen.getByDisplayValue('No meal');

    await user.type(nameInput, 'Test Item');
    await user.selectOptions(saladSelect, 'Caesar Salad');
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.getByDisplayValue('No meal')).toBeInTheDocument();
    });

    expect(nameInput.value).toBe('');
  });

  it('should handle salad selection change', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const saladSelect = screen.getByDisplayValue('No meal');
    await user.selectOptions(saladSelect, 'Greek Salad');

    expect(saladSelect.value).toBe('Greek Salad');
  });

  it('should maintain salad selection when changing other fields', async () => {
    const user = userEvent.setup();
    render(<InlineAddRow onSave={mockOnSave} />);

    const nameInput = screen.getByPlaceholderText('Item name');
    const saladSelect = screen.getByDisplayValue('No meal');
    const storeSelect = screen.getByDisplayValue('Fresh Farm');

    await user.selectOptions(saladSelect, 'Caesar Salad');
    await user.type(nameInput, 'Lettuce');
    await user.selectOptions(storeSelect, 'Aldi');

    expect(saladSelect.value).toBe('Caesar Salad');
  });
});
