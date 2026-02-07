import { Problem } from "./Problem";

export interface CurriculumWeekProps {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    category: string;
    problems: {
        problem: Problem;
        dayNumber: number;
        order: number;
    }[];
}

export class CurriculumWeek {
    constructor(private props: CurriculumWeekProps) { }

    get id() { return this.props.id; }
    get weekNumber() { return this.props.weekNumber; }
    get title() { return this.props.title; }
    get description() { return this.props.description; }
    get category() { return this.props.category; }
    get problems() { return this.props.problems; }

    isGated(isPro: boolean): boolean {
        return !isPro && this.props.weekNumber > 1;
    }
}

