import { ExceptionContract } from ".."

export type PaginationData<T> = {
  all: T[],
  meta: {
    currentPage: number
    firstPage: number
    lastPage: number
    totalItens: number
  }
}

export type Pagination<T> = ApiResponse<PaginationData<T>>


export type SucessApiResponse<T> = { state: 'Sucess', data: T }
export type FailureApiResponse = { state: 'Failure', error: keyof ExceptionContract|object }

export type ApiResponse<T> = SucessApiResponse<T> | FailureApiResponse

export type GenericResponse = { state: 'Sucess' } | { state: 'Failure', error?: keyof ExceptionContract|object }
  