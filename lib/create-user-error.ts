export class CreateUserError extends Error {
  public static readonly errorMessages = {
    USER_CREATION_FAILED: "Failed to create user.",
    USER_DELETION_FAILED: "Failed to delete user.",
    TOKEN_CREATION_FAILED: "Failed to insert token.",
    INTERNAL_ERROR: "Something went wrong.",
  } as const;

  public readonly code: keyof typeof CreateUserError.errorMessages;

  constructor(code: keyof typeof CreateUserError.errorMessages) {
    const message = CreateUserError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "CreateUserError";
  }

  public static getErrorMessage(
    code: keyof typeof CreateUserError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
