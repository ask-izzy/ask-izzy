
export {};

declare global {
    interface Moment {
        format(fmtStr: string): string;
        isSame(other: Moment | null | undefined): boolean;
        diff(other: Moment, type: string): number;
        add(amount: number, unit: string): Moment;
        isBefore(other: Moment): boolean;
        isAfter(other: Moment): boolean;
        startOf(type: string): Moment;
        clone(): Moment;
        utcOffset(offset: string): any;
        day(day: number | string): any;
    }
}
