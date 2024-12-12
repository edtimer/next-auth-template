export class CheckUserExistsError extends Error {
  public static readonly errorMessages = {
    USER_NOT_FOUND: "User not found.",
  } as const;

  public readonly code: keyof typeof CheckUserExistsError.errorMessages;

  constructor(code: keyof typeof CheckUserExistsError.errorMessages) {
    const message = CheckUserExistsError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "ResetPasswordTokenVerificationError";
  }

  public static getErrorMessage(
    code: keyof typeof CheckUserExistsError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
