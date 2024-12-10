export class ResetPasswordTokenVerificationError extends Error {
  // Define all possible error types and their default messages
  public static readonly errorMessages = {
    // For user-actionable errors, we're specific about what went wrong
    TOKEN_NOT_FOUND: "Reset token not found.",
    TOKEN_EXPIRED: "Reset token has expired.",
    TOKEN_INVALID: "Reset token is invalid.",
    // For system/technical errors, we give a friendly, general messages
    SYSTEM_ERROR: "Something went wrong.",
  } as const;
  // Create a type from the keys of our messages object
  public readonly code: keyof typeof ResetPasswordTokenVerificationError.errorMessages;
  constructor(
    code: keyof typeof ResetPasswordTokenVerificationError.errorMessages,
    customMessage?: string
  ) {
    // Use custom message if provided, otherwise use default message for this code
    const message =
      customMessage ?? ResetPasswordTokenVerificationError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "ResetPasswordTokenVerificationError";
  }

  // Add a method to get the message for a specific code
  public static getErrorMessage(
    code: keyof typeof ResetPasswordTokenVerificationError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}

export class VerifyEmailTokenVerificationError extends Error {
  // Define all possible error types and their default messages
  public static readonly errorMessages = {
    // For user-actionable errors, we're specific about what went wrong
    TOKEN_NOT_FOUND: "Verification token not found.",
    TOKEN_EXPIRED: "Verification token has expired.",
    TOKEN_INVALID: "Verification token is invalid.",
    // For system/technical errors, we give a friendly, general messages
    SYSTEM_ERROR: "Something went wrong.",
  } as const;
  // Create a type from the keys of our messages object
  public readonly code: keyof typeof VerifyEmailTokenVerificationError.errorMessages;
  constructor(
    code: keyof typeof VerifyEmailTokenVerificationError.errorMessages,
    customMessage?: string
  ) {
    // Use custom message if provided, otherwise use default message for this code
    const message =
      customMessage ?? VerifyEmailTokenVerificationError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "VerifyEmailTokenVerificationError";
  }

  // Add a method to get the message for a specific code
  public static getErrorMessage(
    code: keyof typeof VerifyEmailTokenVerificationError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
