import * as storage from '../dataStorage';
jest.mock('fs/promises');
import * as fsPromises from 'fs/promises';

const mockedFsPromises = fsPromises as jest.Mocked<typeof fsPromises>;

const filePath = '/path/to/file';
