export class CommentValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'CommentValidationError'
  }
}

export class CommentAuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CommentAuthorizationError'
  }
}

export class CommentNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CommentNotFoundError'
  }
}
