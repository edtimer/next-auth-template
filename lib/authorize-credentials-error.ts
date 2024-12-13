export class AuthorizeCredentialsError extends Error {
  public static readonly errorMessages = {
    EMAIL_SENT: "Verification email sent.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    INTERNAL_ERROR: "Something went wrong.",
  } as const;

  public readonly code: keyof typeof AuthorizeCredentialsError.errorMessages;

  constructor(code: keyof typeof AuthorizeCredentialsError.errorMessages) {
    const message = AuthorizeCredentialsError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "AuthorizeCredentialsError";
  }

  public static getErrorMessage(
    code: keyof typeof AuthorizeCredentialsError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
