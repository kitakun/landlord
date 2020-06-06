export function prepareUrl(rawUrl: string): string {
    return process.env.NODE_ENV === 'production'
        ? rawUrl
        : `http://127.0.0.1:3000${rawUrl}`;
}