export class CreatePasswordResetTokenError extends Error {
  public static readonly errorMessages = {
    TOKEN_CREATION_FAILED: "Failed to create password reset token.",
    TOKEN_DELETION_FAILED: "Failed to delete password reset token.",
  } as const;

  public readonly code: keyof typeof CreatePasswordResetTokenError.errorMessages;

  constructor(code: keyof typeof CreatePasswordResetTokenError.errorMessages) {
    const message = CreatePasswordResetTokenError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "CreatePasswordResetTokenError";
  }

  public static getErrorMessage(
    code: keyof typeof CreatePasswordResetTokenError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
