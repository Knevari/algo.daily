import { motion } from 'framer-motion';
import Link from 'next/link';

interface CurriculumWidgetProps {
    currentWeek: number;
    weekTitle: string;
    weekProgress: number; // 0-100
    totalProgress: number; // 0-100
}

export function CurriculumWidget({
    currentWeek,
    weekTitle,
    weekProgress,
    totalProgress
}: CurriculumWidgetProps) {
    return (
        <motion.div
            className="p-lg glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-sm">
                <div className="bg-gradient-to-br from-purple-primary to-accent-primary text-white text-xs font-bold px-sm py-xs rounded-full uppercase tracking-wider">
                    Week {currentWeek}
                </div>
                <Link href="/curriculum" className="text-xs text-accent-primary font-medium transition-colors hover:text-purple-primary">
                    View Full Roadmap →
                </Link>
            </div>

            <h3 className="text-lg font-semibold mb-md">{weekTitle}</h3>

            <div className="mb-sm">
                <div className="flex justify-between text-xs text-text-muted mb-xs">
                    <span>Week Progress</span>
                    <span>{Math.round(weekProgress)}%</span>
                </div>
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent-primary to-purple-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${weekProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="pt-sm border-t border-border">
                <span className="text-xs text-text-muted">
                    📚 Overall: {Math.round(totalProgress)}% complete
                </span>
            </div>
        </motion.div>
    );
}
