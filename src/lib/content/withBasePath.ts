export function withBasePath(path: string, basePath = import.meta.env.BASE_URL): string {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  if (path === '/') return normalizedBase;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
