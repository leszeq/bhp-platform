export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: string | null
          company_id: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          role?: string | null
          company_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          role?: string | null
          company_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          course_id: string | null
          title: string | null
          content: string | null
          order_index: number | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          title?: string | null
          content?: string | null
          order_index?: number | null
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string | null
          content?: string | null
          order_index?: number | null
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          id: string
          course_id: string | null
          question_text: string | null
          correct_answer: string | null
          wrong_answers: Json | null
          difficulty: string | null
          is_verified: boolean | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          question_text?: string | null
          correct_answer?: string | null
          wrong_answers?: Json | null
          difficulty?: string | null
          is_verified?: boolean | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          course_id?: string | null
          question_text?: string | null
          correct_answer?: string | null
          wrong_answers?: Json | null
          difficulty?: string | null
          is_verified?: boolean | null
          created_by?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          status: string | null
          score: number | null
          started_at: string | null
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          score?: number | null
          started_at?: string | null
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          score?: number | null
          started_at?: string | null
          finished_at?: string | null
        }
        Relationships: []
      }
      exam_questions: {
        Row: {
          id: string
          exam_id: string | null
          question_id: string | null
          selected_answer: string | null
          is_correct: boolean | null
        }
        Insert: {
          id?: string
          exam_id?: string | null
          question_id?: string | null
          selected_answer?: string | null
          is_correct?: boolean | null
        }
        Update: {
          id?: string
          exam_id?: string | null
          question_id?: string | null
          selected_answer?: string | null
          is_correct?: boolean | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          exam_id: string | null
          certificate_url: string | null
          verification_code: string | null
          issued_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          exam_id?: string | null
          certificate_url?: string | null
          verification_code?: string | null
          issued_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          exam_id?: string | null
          certificate_url?: string | null
          verification_code?: string | null
          issued_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string | null
          owner_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          owner_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          owner_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          id: string
          email: string
          company_id: string | null
          course_id: string | null
          token: string
          status: string | null
          expires_at: string | null
          created_at: string | null
          email_sent_at: string | null
          reminder_count: number | null
        }
        Insert: {
          id?: string
          email: string
          company_id?: string | null
          course_id?: string | null
          token: string
          status?: string | null
          expires_at?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          reminder_count?: number | null
        }
        Update: {
          id?: string
          email?: string
          company_id?: string | null
          course_id?: string | null
          token?: string
          status?: string | null
          expires_at?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          reminder_count?: number | null
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      company_courses: {
        Row: {
          id: string
          company_id: string | null
          course_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          course_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          course_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_courses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
