import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CrestStorageAdapter from '../Adapters/crestStorage.adapter';
const crestStorage = new CrestStorageAdapter();

@Injectable()
export default class CrestService {

    getCrest(username: string, fileName: string): Buffer {
        return crestStorage.getCrest(username, fileName);
    }
}
