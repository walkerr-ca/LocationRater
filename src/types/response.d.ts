export interface BaseResponse<T> {
  success: boolean;
  result: T;
  error?: string;
}
