export class AuthValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'AuthValidationError'
  }
}

export class AuthConflictError extends Error {
  constructor(message: string, public readonly field: 'email' | 'username') {
    super(message)
    this.name = 'AuthConflictError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}
