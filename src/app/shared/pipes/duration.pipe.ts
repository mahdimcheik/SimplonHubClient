import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): string | null {
        const other = args && args.length ? args[0] : undefined;
        if (value == null || other == null) return null;

        const toMs = (v: unknown): number => {
            if (v instanceof Date) return v.getTime();
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
                const t = Date.parse(v);
                return isNaN(t) ? NaN : t;
            }
            return NaN;
        };

        const t1 = toMs(value);
        const t2 = toMs(other);

        if (isNaN(t1) || isNaN(t2)) return null;

        const hours = Math.abs((t1 - t2) / (1000 * 60 * 60));
        // round to 2 decimal places
        return (Math.round(hours * 100) / 100).toString();
    }
}
