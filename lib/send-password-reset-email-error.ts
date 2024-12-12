export class SendPasswordResetEmailError extends Error {
  public static readonly errorMessages = {
    EMAIL_SEND_FAILED: "Unable to send password reset email.",
  } as const;

  public readonly code: keyof typeof SendPasswordResetEmailError.errorMessages;

  constructor(code: keyof typeof SendPasswordResetEmailError.errorMessages) {
    const message = SendPasswordResetEmailError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "SendPasswordResetEmailError";
  }

  public static getErrorMessage(
    code: keyof typeof SendPasswordResetEmailError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
