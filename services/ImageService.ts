
import { BaseHTTPService } from './BaseHTTPService'
import { ApiResponse } from "../usecases/BaseUsecase"
import { ResponseHandler, ImageRepository, ConstantsRepository, UserRepository } from '../contracts'
import { ImageFolders, ImageInsert, ImageUrl, ImagesUsecase } from '../usecases'
import { UserEntity } from '../entities'

export class ImageService extends BaseHTTPService implements ImagesUsecase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly constantsRepostory: ConstantsRepository,
    private readonly userRepository: UserRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  async updateUserImage(user: UserEntity|undefined, imageBody: ImageInsert): Promise<ApiResponse<ImageUrl>> {
    if(!user) { return this.responseHandler.Unauthenticated()  }

    const verifySize = await this.verifySizeOfImage<string>(user, imageBody)
    if (verifySize !== 'ok') { return verifySize }

    if (user.imageUrl) {
        await this.imageRepository.delete(user.imageUrl)
    }

    const newImageUrl = await this.imageRepository.post(imageBody, 'user')
    await this.userRepository.update(user.id, { imageUrl: newImageUrl })
    return this.responseHandler.SucessfullyUpdated(newImageUrl)
  }


  async postImage(user: UserEntity|undefined, image: ImageInsert, folder: Exclude<ImageFolders, 'user'>): Promise<ApiResponse<string>> {
    if(!user) { return this.responseHandler.Unauthenticated()  }

    const verifySize = await this.verifySizeOfImage<string>(user, image)
    if (verifySize !== 'ok') { return verifySize }

    return this.responseHandler.SucessfullyCreated(
        await this.imageRepository.post(image, folder)
    )
  }


  private async verifySizeOfImage<T>(user: UserEntity, imageBody: ImageInsert): Promise<ApiResponse<T>|'ok'>{
    const imageBythes = imageBody.sizeInBytes
    const { maxImageBythesByNonPremium } = await this.constantsRepostory.getConfig()

    if(!user.isPremium && imageBythes > maxImageBythesByNonPremium) {
        return this.responseHandler.ImageToLarge()
    }
    return 'ok'
  }

  async restore(path: string): Promise<File|undefined> {
    const image = await this.imageRepository.restore(path)
    if(!image) {
        this.responseHandler.NotFound()
        return undefined
    }
    return image
  }
}
