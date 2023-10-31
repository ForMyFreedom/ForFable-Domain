
import { ExceptionHandler, ExceptionContract } from "../contracts";

export abstract class BaseHTTPService {
  
    constructor(
      public exceptionHandler: ExceptionHandler
    ) { }
}

export type Pagination<T> = ApiResponse<{
  all: T[],
  meta: {
    currentPage: number
    firstPage: number
    lastPage: number
    totalItens: number
  }
}>

export type ApiResponse<T> = {
  data?: T
  error?: keyof ExceptionContract|object
}

export type GenericResponse = {
  error?: string|object
}

