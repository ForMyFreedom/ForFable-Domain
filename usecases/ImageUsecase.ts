import { ApiResponse, UserEntity } from '..'

export type ImageUrl = string

export interface ImageInsert {
  name: string
  extension: string
  sizeInBytes: number
  move: (path: string, savingName: string) => Promise<void>
} 

export const ImageFoldersConst = ['genre', 'comment', 'user'] as const
export type ImageFolders = typeof ImageFoldersConst[number]

export interface ImagesUsecase {
  restore(path: string): Promise<File|undefined>
  postImage(user: UserEntity|undefined, imageBody: ImageInsert, folder: Exclude<ImageFolders, 'user'>): Promise<ApiResponse<ImageUrl>>
  updateUserImage(user: UserEntity|undefined, image: ImageInsert): Promise<ApiResponse<ImageUrl>>
}

export interface ImagesController extends Omit<ImagesUsecase, 'updateUserImage'|'postImage'> {
  postImage(imageBody: ImageInsert, folder: Omit<ImageFolders, 'user'>): Promise<ApiResponse<ImageUrl>>
  updateUserImage(image: ImageInsert): Promise<ApiResponse<ImageUrl>>
}
