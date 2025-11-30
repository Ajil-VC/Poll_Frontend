export interface AuthResponse<T> {
    status: boolean,
    message: string,
    data: T,
    token?: string
}