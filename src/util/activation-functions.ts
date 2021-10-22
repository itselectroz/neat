export function sigmoid(x: number): number {
    return 1.0 / (1.0 + Math.exp(-x));
}