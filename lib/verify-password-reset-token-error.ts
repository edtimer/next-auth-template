export class VerifyPasswordResetTokenError extends Error {
  public static readonly errorMessages = {
    TOKEN_NOT_FOUND: "Reset token not found.",
    TOKEN_EXPIRED: "Reset token has expired.",
    TOKEN_INVALID: "Reset token is invalid.",
    INTERNAL_ERROR: "Something went wrong.",
  } as const;

  public readonly code: keyof typeof VerifyPasswordResetTokenError.errorMessages;

  constructor(code: keyof typeof VerifyPasswordResetTokenError.errorMessages) {
    const message = VerifyPasswordResetTokenError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "VerifyPasswordResetTokenError";
  }

  // Add a method to get the message for a specific code
  public static getErrorMessage(
    code: keyof typeof VerifyPasswordResetTokenError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}

