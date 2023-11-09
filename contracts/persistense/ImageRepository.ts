import { ImageInsert, ImageFolders } from "../../usecases"

export interface ImageRepository {
    post(image: ImageInsert, folder: ImageFolders): Promise<string|undefined>
    delete(path: string): Promise<void>
    restore(path: string): Promise<File|undefined>
}
