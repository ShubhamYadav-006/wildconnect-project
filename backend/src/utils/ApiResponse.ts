export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;
  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }

  // Standard success response helper
  static success<T>(message: string, data?: T) {
    return new ApiResponse(message, data);
  }

  // Standard pagination response helper
  static paginated<T>(message: string, data: T, page: number, limit: number, total: number) {
    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
