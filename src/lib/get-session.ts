import { cache } from "react";
import { auth } from "@/auth";

/**
 * Cached auth session untuk Server Components
 * Menggunakan React cache() untuk deduplicate requests dalam single render
 *
 * ⚡ Performance Benefits:
 * - Menghilangkan duplicate auth calls dalam satu render tree
 * - Cache bertahan selama request lifecycle
 * - Mengurangi latency dari multiple auth checks
 *
 * 🔒 Security:
 * - Auth check tetap dilakukan di proxy.ts (edge middleware)
 * - Function ini hanya optimization untuk reduce redundant calls
 *
 * @returns Session object atau null jika tidak authenticated
 *
 * @example
 * ```tsx
 * // Di Server Component
 * import { getSession } from "@/lib/get-session";
 *
 * export default async function MyComponent() {
 *   const session = await getSession();
 *   return <div>Hello {session?.user.email}</div>;
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
 *   const session = await getSession();
 *   if (!session) throw new Error("Unauthorized");
 *   // ... action logic
 * }
 * ```
 */
export const getSession = cache(async () => {
  return await auth();
});
