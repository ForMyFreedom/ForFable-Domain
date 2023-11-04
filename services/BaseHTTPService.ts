
import { ResponseHandler } from "../contracts";

export abstract class BaseHTTPService {
  
    constructor(
      public responseHandler: ResponseHandler
    ) { }
}

