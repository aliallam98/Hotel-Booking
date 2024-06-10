
export interface IErrorClass extends Error {
  status:number
}

class ErrorClass extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
  }
}

export default ErrorClass;
