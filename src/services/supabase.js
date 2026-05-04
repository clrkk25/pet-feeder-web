import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vchehfrjgoibvcyjzlel.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaGVoZnJqZ29pYnZjeWp6bGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODIyNzAsImV4cCI6MjA4OTc1ODI3MH0.QDHC5zxavPCU0g3LKj0oM8yMloL7G_2J0SIMD2dWfFA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const authService = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getCurrentUser() {
    const { data } = supabase.auth.getUser()
    return data.user
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const deviceService = {
  async getDevices() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addDevice(deviceMac, deviceName) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')

    const { data, error } = await supabase
      .from('devices')
      .insert({
        device_mac: deviceMac,
        device_name: deviceName,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteDevice(deviceId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')

    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async getAllFeedRecords() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('feed_records')
      .select(`
        *,
        devices ( device_name )
      `)
      .order('feed_time', { ascending: false })
      .limit(100)

    if (error) {
      console.error('获取喂食记录失败:', error)
      throw error
    }
    return data || []
  },

  async getFeedRecords(deviceId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('feed_records')
      .select('*')
      .eq('device_id', deviceId)
      .order('feed_time', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  },

  async addFeedRecord(deviceId, amount, grams, feedType) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')

    const { data, error } = await supabase
      .from('feed_records')
      .insert({
        device_id: deviceId,
        amount,
        grams,
        feed_type: feedType
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
