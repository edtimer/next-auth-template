export class CheckSubscriberExistsError extends Error {
  public static readonly errorMessages = {
    USER_NOT_FOUND: "User not found.",
    INTERNAL_ERROR: "Something went wrong.",
  } as const;

  public readonly code: keyof typeof CheckSubscriberExistsError.errorMessages;

  constructor(code: keyof typeof CheckSubscriberExistsError.errorMessages) {
    const message = CheckSubscriberExistsError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "CheckUserExistsError";
  }

  public static getErrorMessage(
    code: keyof typeof CheckSubscriberExistsError.errorMessages
  ) {
    return this.errorMessages[code];
  }
}
