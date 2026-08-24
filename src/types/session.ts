export interface Session {
  id?: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
