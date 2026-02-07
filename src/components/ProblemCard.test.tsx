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
            />
        );

        expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        // Link doesn't have disabled attribute like button, but we can check class or content
        expect(screen.getByText('COMPLETED')).toHaveClass('cursor-default');
    });
});
