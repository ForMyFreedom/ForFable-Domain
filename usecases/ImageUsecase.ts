
import { ApiResponse, UserEntity } from '..'

export type ImageUrl = string

export interface ImagesUsecase {
  updateImage(userId: UserEntity['id'], image: File): Promise<ApiResponse<ImageUrl>>
}

export interface ImagesController extends Omit<ImagesUsecase, 'updateImage'> {
  updateImage(image: File): Promise<ApiResponse<ImageUrl>>
}
