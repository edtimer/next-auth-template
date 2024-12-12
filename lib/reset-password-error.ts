export class ResetPasswordError extends Error {
  public static readonly errorMessages = {
    PASSWORD_RESET_FAILED: "Failed to reset password.",
  } as const;

  public readonly code: keyof typeof ResetPasswordError.errorMessages;

  constructor(code: keyof typeof ResetPasswordError.errorMessages) {
    const message = ResetPasswordError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "ResetPasswordError";
  }
  public static getErrorMessage(
    code: keyof typeof ResetPasswordError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
