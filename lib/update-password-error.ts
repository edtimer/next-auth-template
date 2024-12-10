export class UpdatePasswordError extends Error {
  // Define all possible error types and their default messages
  public static readonly errorMessages = {
    // For user-actionable errors, we're specific about what went wrong
    PASSWORD_UPDATE_FAILED: "Failed to update password.",
    // For system/technical errors, we give a friendly, general messages
    SYSTEM_ERROR: "Something went wrong.",
  } as const;
  // Create a type from the keys of our messages object
  public readonly code: keyof typeof UpdatePasswordError.errorMessages;
  constructor(
    code: keyof typeof UpdatePasswordError.errorMessages,
    customMessage?: string
  ) {
    // Use custom message if provided, otherwise use default message for this code
    const message = customMessage ?? UpdatePasswordError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "UpdatePasswordError";
  }

  // Add a method to get the message for a specific code
  public static getErrorMessage(
    code: keyof typeof UpdatePasswordError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
