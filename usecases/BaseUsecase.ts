import { ExceptionContract } from ".."

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
  