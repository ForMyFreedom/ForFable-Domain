import { ApiResponse } from "."
import { ConstantEntity } from "../entities"

export interface ConstantsUsecase {
  show(): Promise<ApiResponse<ConstantEntity>>
  update(contant: Partial<ConstantEntity>): Promise<ApiResponse<ConstantEntity>>
}

export interface ConstantsController extends ConstantsUsecase { }
