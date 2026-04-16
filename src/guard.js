import { supabase } from './supabase.js'

export async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = '/'
    return null
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, is_admin')
    .eq('id', session.user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    window.location.href = '/profile.html'
    return null
  }
  return profile
}

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = '/'
    return null
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, is_admin')
    .eq('id', session.user.id)
    .maybeSingle()
  return profile
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/'
}
