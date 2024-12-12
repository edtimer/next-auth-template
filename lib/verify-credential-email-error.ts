export class VerifyCredentialEmailError extends Error {
  public static readonly errorMessages = {
    TOKEN_NOT_FOUND: "Verification token not found.",
    TOKEN_EXPIRED: "Verification token has expired.",
    TOKEN_INVALID: "Verification token is invalid.",
    INTERNAL_ERROR: "Something went wrong.",
  } as const;

  public readonly code: keyof typeof VerifyCredentialEmailError.errorMessages;

  constructor(code: keyof typeof VerifyCredentialEmailError.errorMessages) {
    const message = VerifyCredentialEmailError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "VerifyCredentialEmailError";
  }

  public static getErrorMessage(
    code: keyof typeof VerifyCredentialEmailError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
