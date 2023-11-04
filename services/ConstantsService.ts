import { BaseHTTPService } from "./BaseHTTPService"
import { ApiResponse } from "../usecases/BaseUsecase"
import { ResponseHandler, ConstantsRepository } from "../contracts"
import { ConstantEntity } from "../entities"
import { ConstantsUsecase } from "../usecases"

export class ConstantsService extends BaseHTTPService implements ConstantsUsecase {
  constructor(
    private readonly constantsRepository: ConstantsRepository,
    public responseHandler: ResponseHandler
  ) { super(responseHandler) }

  public async show(): Promise<ApiResponse<ConstantEntity>> {
    const theConfig = await this.constantsRepository.getConfig()
    return this.responseHandler.SucessfullyRecovered(theConfig)
  }

  public async update(contant: Partial<ConstantEntity>): Promise<ApiResponse<ConstantEntity>> {
    const theConfig = await this.constantsRepository.getConfig()
    if(!theConfig){
      return this.responseHandler.ServerMisconfigured()
    }
    const updatedConfig = await this.constantsRepository.update(contant)
    return this.responseHandler.SucessfullyUpdated(updatedConfig)
  }
}
