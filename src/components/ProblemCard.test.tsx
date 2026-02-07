import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemCard } from './ProblemCard';
import '@testing-library/jest-dom';

const mockProblem = {
    id: '1',
    title: 'Test Problem',
    slug: 'test-problem',
    difficulty: 'Easy' as const,
    category: 'Arrays',
    externalUrl: 'https://example.com/problem',
    isBonus: false
};

describe('ProblemCard', () => {
    it('renders problem details correctly', () => {
        render(
            <ProblemCard
                problem={mockProblem}
                isCompleted={false}
                onVerify={jest.fn()}
            />
        );

        expect(screen.getByText('Test Problem')).toBeInTheDocument();
        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('// Arrays')).toBeInTheDocument();
    });

    it('shows COMPLETED state when isCompleted is true', () => {
        render(
            <ProblemCard
                problem={mockProblem}
                isCompleted={true}
                onVerify={jest.fn()}
            />
        );

        expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /COMPLETED/i })).toBeDisabled();
    });

    it('calls onVerify when verify button is clicked', async () => {
        const handleVerify = jest.fn().mockResolvedValue(true);
        render(
            <ProblemCard
                problem={mockProblem}
                isCompleted={false}
                onVerify={handleVerify}
            />
        );

        fireEvent.click(screen.getByText('VERIFY_submission()'));

        expect(handleVerify).toHaveBeenCalledWith('1');
        // Wait for state update
        await screen.findByText('VERIFY_submission()');
    });
});
