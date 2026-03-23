// ============================================
// REEL - Database Types
// Auto-generated from Supabase schema
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          backdrop_url: string | null
          letterboxd_username: string | null
          location: string | null
          website: string | null
          is_verified: boolean
          films_count: number
          followers_count: number
          following_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          backdrop_url?: string | null
          letterboxd_username?: string | null
          location?: string | null
          website?: string | null
          is_verified?: boolean
          films_count?: number
          followers_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      film_logs: {
        Row: {
          id: string
          user_id: string
          film_id: number
          rating: number | null
          is_rewatch: boolean
          watched_date: string
          review: string | null
          review_contains_spoilers: boolean
          liked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          film_id: number
          rating?: number | null
          is_rewatch?: boolean
          watched_date?: string
          review?: string | null
          review_contains_spoilers?: boolean
          liked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['film_logs']['Insert']>
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          film_id: number
          film_title: string
          film_poster: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          film_id: number
          film_title: string
          film_poster?: string | null
          added_at?: string
        }
        Update: Partial<Database['public']['Tables']['watchlist']['Insert']>
      }
      lists: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          is_public: boolean
          likes_count: number
          films_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          is_public?: boolean
          likes_count?: number
          films_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['lists']['Insert']>
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['follows']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string | null
          message_type: string
          metadata: Json | null
          is_deleted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content?: string | null
          message_type?: string
          metadata?: Json | null
          is_deleted?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
          last_read_at: string | null
        }
        Insert: {
          conversation_id: string
          user_id: string
          last_read_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['conversation_participants']['Insert']>
      }
      watch_parties: {
        Row: {
          id: string
          host_id: string
          film_id: number | null
          film_title: string
          film_poster: string | null
          ott_platform: string
          scheduled_at: string | null
          started_at: string | null
          ended_at: string | null
          status: string
          sync_state: Json
          invite_code: string
          max_participants: number
          created_at: string
        }
        Insert: {
          id?: string
          host_id: string
          film_id?: number | null
          film_title: string
          film_poster?: string | null
          ott_platform: string
          scheduled_at?: string | null
          started_at?: string | null
          ended_at?: string | null
          status?: string
          sync_state?: Json
          invite_code?: string
          max_participants?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['watch_parties']['Insert']>
      }
      clubs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          banner_url: string | null
          members_count: number
          posts_count: number
          is_official: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          banner_url?: string | null
          members_count?: number
          posts_count?: number
          is_official?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['clubs']['Insert']>
      }
      posts: {
        Row: {
          id: string
          author_id: string
          club_id: string | null
          content: string
          image_url: string | null
          film_reference: Json | null
          likes_count: number
          comments_count: number
          is_spoiler: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          club_id?: string | null
          content: string
          image_url?: string | null
          film_reference?: Json | null
          likes_count?: number
          comments_count?: number
          is_spoiler?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          image_url: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body?: string | null
          image_url?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      person_locks: {
        Row: {
          id: string
          user_id: string
          tmdb_person_id: number
          person_name: string
          person_photo: string | null
          person_role: string | null
          notify_new_project: boolean
          notify_trailer: boolean
          notify_theatre: boolean
          notify_streaming: boolean
          notify_awards: boolean
          locked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_person_id: number
          person_name: string
          person_photo?: string | null
          person_role?: string | null
          notify_new_project?: boolean
          notify_trailer?: boolean
          notify_theatre?: boolean
          notify_streaming?: boolean
          notify_awards?: boolean
          locked_at?: string
        }
        Update: Partial<Database['public']['Tables']['person_locks']['Insert']>
      }
      film_interests: {
        Row: {
          user_id: string
          film_id: number
          film_title: string
          film_poster: string | null
          release_date: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          film_id: number
          film_title: string
          film_poster?: string | null
          release_date?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['film_interests']['Insert']>
      }
      donations: {
        Row: {
          id: string
          user_id: string | null
          amount_inr: number
          currency: string
          donor_name: string | null
          message: string | null
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount_inr: number
          currency?: string
          donor_name?: string | null
          message?: string | null
          is_anonymous?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['donations']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type FilmLog = Database['public']['Tables']['film_logs']['Row']
export type Watchlist = Database['public']['Tables']['watchlist']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Club = Database['public']['Tables']['clubs']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type WatchParty = Database['public']['Tables']['watch_parties']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type PersonLock = Database['public']['Tables']['person_locks']['Row']
