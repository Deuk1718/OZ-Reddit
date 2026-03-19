export class VoteValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'VoteValidationError'
  }
}

export class VoteAuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VoteAuthorizationError'
  }
}

export class VoteNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VoteNotFoundError'
  }
}
