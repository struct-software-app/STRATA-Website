import type { SupabaseClient, User } from '@supabase/supabase-js';

export interface BootstrapUserExtra {
  username?: string;
  firstName?: string;
  secondName?: string;
  birthdate?: string | null;
}

export async function bootstrapNewUser(
  supabase: SupabaseClient,
  user: Pick<User, 'id' | 'email' | 'user_metadata'>,
  extra: BootstrapUserExtra = {}
): Promise<{ error: string | null }> {
  const email = (user.email || '').trim();
  const meta = user.user_metadata || {};
  const username = String(extra.username ?? meta.username ?? email.split('@')[0] ?? 'user').trim();
  const firstName = String(extra.firstName ?? meta.firstName ?? '').trim();
  const secondName = String(extra.secondName ?? meta.secondName ?? '').trim();
  const rawBirthdate = extra.birthdate ?? meta.birthdate ?? null;
  const birthdate = typeof rawBirthdate === 'string' && rawBirthdate.trim() !== '' ? rawBirthdate.trim() : null;

  const { error: userError } = await supabase.from('users').upsert({
    id: user.id,
    username: username || email.split('@')[0] || 'user',
    firstName,
    secondName,
    email,
    birthdate,
  });

  if (userError) {
    return { error: userError.message };
  }

  // SECURITY TODO: the welcome balance must be granted by a database trigger, not by the browser. See supabase/README.md.
  const { error: walletError } = await supabase
    .from('user_wallets')
    .upsert({ user_id: user.id, tokens: 50 }, { onConflict: 'user_id', ignoreDuplicates: true });

  if (walletError) {
    return { error: walletError.message };
  }

  return { error: null };
}
