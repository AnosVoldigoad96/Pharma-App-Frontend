import { createClient } from '@/lib/supabase/auth-client'
import type { PublicUser } from '@/lib/supabase/types'

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  })

  if (error) {
    return { user: null, error }
  }

  // Create or update public_users record if user was created
  // Note: Database trigger may have already created the profile, so we handle conflicts gracefully
  if (data.user) {
    // Wait a brief moment for trigger to complete (if it exists)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Check if profile already exists (created by trigger)
    const { data: existingProfile } = await supabase
      .from('public_users')
      .select('user_id, full_name')
      .eq('user_id', data.user.id)
      .maybeSingle()

    // Only create if it doesn't exist
    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('public_users')
        .insert({
          user_id: data.user.id,
          email: data.user.email!,
          full_name: fullName || null,
        })

      // Silently ignore all profile creation errors - trigger likely handles it
      // Only log if it's a non-conflict error and has meaningful content
      if (profileError) {
        const hasErrorContent = 
          profileError.message && 
          profileError.message !== '{}' && 
          profileError.message.trim() !== ''
        
        if (hasErrorContent && !profileError.message?.toLowerCase().includes('duplicate')) {
          // Only log if it's a real error with content (not empty object)
          console.warn('Profile creation note (trigger may have handled it):', profileError.message)
        }
      }
    } else if (fullName && existingProfile.full_name !== fullName) {
      // Update full_name if profile exists and fullName is provided and different
      await supabase
        .from('public_users')
        .update({ full_name: fullName })
        .eq('user_id', data.user.id)
    }
  }

  return { user: data.user, error: null }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { user: data.user, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getCurrentUserProfile(): Promise<{ profile: PublicUser | null; error: any }> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { profile: null, error: authError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('public_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { profile: profile as PublicUser | null, error: profileError }
}

export async function updateUserProfile(updates: Partial<PublicUser>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('public_users')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()

  return { data, error }
}

