import { AppItem } from '../data/apps';

export function searchApps<T extends AppItem>(apps: T[], query: string, limit = 8): T[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return apps.slice(0, limit);
  }
  return apps
    .filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.categoryName.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.standards?.some((s) => s.toLowerCase().includes(q))
    )
    .slice(0, limit);
}
