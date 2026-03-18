export class SubredditValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'SubredditValidationError'
  }
}

export class SubredditConflictError extends Error {
  constructor(message: string, public readonly field: 'name') {
    super(message)
    this.name = 'SubredditConflictError'
  }
}

export class SubredditAuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubredditAuthorizationError'
  }
}

export class SubredditNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubredditNotFoundError'
  }
}
