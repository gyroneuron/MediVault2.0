import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import secure from '../lib/secure.json'
import 'react-native-url-polyfill/auto';

const supabaseUrl = secure.supabaseUrl
const supabaseAnonKey = secure.supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})