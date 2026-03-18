export class PostValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'PostValidationError'
  }
}

export class PostAuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PostAuthorizationError'
  }
}

export class PostNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PostNotFoundError'
  }
}
