export interface AnalyticResult {
    total: number;
    period: string;
    shreddedTotal: number;
    ignoredTotal: number;
}

export async function listAnalytics(): Promise<Array<AnalyticResult>> {
    const response = await fetch(`/api/analytics`);

    return await response.json();
}
