import { Socket } from 'socket.io';

export const wrapSocketAsync = (socket: Socket, fn: Function) => {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error(err);

      if (err instanceof CustomError) socket.emit('error', { statusCode: err.statusCode, message: err.message });
    }
  };
};


export class CustomError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
