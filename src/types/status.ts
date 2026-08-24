export interface StatusData {
  updatedAt: Date;
  database: {
    maxConnections: number;
    activeUsers: string;
    version?: string;
  };
}
