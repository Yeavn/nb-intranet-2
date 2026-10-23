import { createClient } from '@supabase/supabase-js'

/**
 * Client mit dem geheimen Server-Key: umgeht Row-Level-Security.
 * Nur in API-Routen verwenden, die vorher die Berechtigung prüfen (z. B. checkAdmin)!
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) {
    throw new Error('SUPABASE_SECRET_KEY fehlt in den Umgebungsvariablen.')
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
