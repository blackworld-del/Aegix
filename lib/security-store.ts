export type AttemptRecord = {
  count: number
  lastAttempt: number
  locked: boolean
  lockExpiry: number
}

// Singleton pattern for attempt tracking
class SecurityStore {
  private static instance: SecurityStore
  private attempts: Map<string, AttemptRecord>

  private constructor() {
    this.attempts = new Map()
    // Cleanup expired records every hour
    setInterval(() => this.cleanupExpiredRecords(), 60 * 60 * 1000)
  }

  public static getInstance(): SecurityStore {
    if (!SecurityStore.instance) {
      SecurityStore.instance = new SecurityStore()
    }
    return SecurityStore.instance
  }

  public getAttemptRecord(ip: string): AttemptRecord {
    return this.attempts.get(ip) || {
      count: 0,
      lastAttempt: Date.now(),
      locked: false,
      lockExpiry: 0
    }
  }

  public setAttemptRecord(ip: string, record: AttemptRecord): void {
    this.attempts.set(ip, record)
  }

  public clearAttemptRecord(ip: string): void {
    this.attempts.delete(ip)
  }

  private cleanupExpiredRecords(): void {
    const now = Date.now()
    for (const [ip, record] of this.attempts.entries()) {
      // Remove unlocked records older than 24 hours
      if (!record.locked && now - record.lastAttempt > 24 * 60 * 60 * 1000) {
        this.attempts.delete(ip)
      }
      // Remove expired lockouts
      else if (record.locked && now > record.lockExpiry) {
        this.attempts.delete(ip)
      }
    }
  }
}

export default SecurityStore.getInstance()
