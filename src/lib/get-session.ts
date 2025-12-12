import { cache } from "react";
import { auth } from "@/auth";

/**
 * Cached auth session untuk Server Components dan Server Actions
 * Menggunakan React cache() untuk deduplicate requests dalam single render
 *
 * ⚡ Performance Benefits:
 * - Menghilangkan duplicate auth calls dalam satu render tree
 * - Cache bertahan selama request lifecycle (single HTTP request)
 * - Mengurangi latency dari multiple auth checks
 * - Semua getSession() calls dalam satu request akan share hasil yang sama
 *
 * 🔒 Security:
 * - Auth check utama dilakukan di proxy.ts (edge middleware)
 * - Protected routes (/dashboard, /admin, /profile, /events) sudah di-guard middleware
 * - Function ini adalah optimization layer, bukan security layer
 *
 * 📋 Best Practices:
 * - SELALU gunakan getSession() daripada auth() langsung di Server Components/Actions
 * - Untuk protected routes, session dijamin ada oleh middleware - gunakan non-null assertion
 * - Untuk public routes atau routes yang bisa diakses tanpa auth, handle null case
 *
 * @returns Session object atau null jika tidak authenticated
 *
 * @example
 * ```tsx
 * // Di Protected Route Server Component (session guaranteed by middleware)
 * import { getSession } from "@/lib/get-session";
 *
 * export default async function DashboardPage() {
 *   const session = (await getSession())!; // Non-null assertion safe here
 *   return <div>Hello {session.user.email}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Di Server Action
 * "use server";
 * import { getSession } from "@/lib/get-session";
 *
 * export async function myAction() {
 *   const session = (await getSession())!;
 *   const token = session.token;
 *   // ... action logic with guaranteed session
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Di Public Route (optional auth)
 * import { getSession } from "@/lib/get-session";
 *
 * export default async function PublicPage() {
 *   const session = await getSession();
 *   return session ? <UserNav /> : <GuestNav />;
 * }
 * ```
 */
export const getSession = cache(async () => {
  return await auth();
});
