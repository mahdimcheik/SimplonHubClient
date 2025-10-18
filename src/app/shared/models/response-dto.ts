export type ResponseDTO<T> = {
    message: string;
    status: number;
    data?: T;
    count?: number;
};
