import * as storage from '../dataStorage';
jest.mock('fs/promises');
import * as fsPromises from 'fs/promises';

const mockedFsPromises = fsPromises as jest.Mocked<typeof fsPromises>;

const filePath = '/path/to/file';
const notFoundError = new Error('ENOENT: no such file or directory');
(notFoundError as any).code = 'ENOENT';
describe('deleteFile', () => {
  it('should delete a file successfully', async () => {
    mockedFsPromises.rm.mockResolvedValue(undefined as never);
    storage.deleteFile(filePath);
    expect(mockedFsPromises.rm).toHaveBeenCalledWith(filePath, {
      recursive: true,
      force: true,
    });
  });
  it('should handle errors from deleting a file', async () => {
    mockedFsPromises.rm.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.deleteFile(filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
});
describe('copyFile', () => {
  it('should copy a file successfully', async () => {
    mockedFsPromises.copyFile.mockResolvedValue(undefined as never);
    storage.copyFile(filePath, filePath);
    expect(mockedFsPromises.copyFile).toHaveBeenCalledWith(filePath, filePath);
  });
  it('should handle file not found error from copying a file', async () => {
    mockedFsPromises.copyFile.mockRejectedValue(notFoundError);
    await expect(storage.copyFile(filePath, filePath)).rejects.toThrow(
      'File not found: ' + filePath,
    );
  });
  it('should handle other errors from copying a file', async () => {
    mockedFsPromises.copyFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.copyFile(filePath, filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
});
describe('writeFile', () => {
  it('should write a file successfully', async () => {
    mockedFsPromises.writeFile.mockResolvedValue(undefined as never);
    storage.writeFile(filePath, 'content');
    expect(mockedFsPromises.writeFile).toHaveBeenCalledWith(
      filePath,
      'content',
    );
  });
  it('should handle other errors from writing a file', async () => {
    mockedFsPromises.writeFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.writeFile(filePath, filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
});
describe('readFile', () => {
  it('should read a file successfully', async () => {
    mockedFsPromises.readFile.mockResolvedValue(Buffer.from('content'));
    const content = await storage.readFile(filePath);
    expect(content).toEqual(Buffer.from('content'));
  });
  it('should handle other errors from reading a file', async () => {
    mockedFsPromises.readFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.readFile(filePath)).rejects.toThrow('Simulated Error');
  });
  it('should handle file not found error when reading a file', async () => {
    mockedFsPromises.readFile.mockRejectedValue(notFoundError);
    await expect(storage.readFile(filePath)).rejects.toThrow(
      'File not found: ' + filePath,
    );
  });
});
describe('readJSONFile', () => {
  it('should read a JSON file successfully', async () => {
    mockedFsPromises.readFile.mockResolvedValue(
      Buffer.from('{"key": "value"}'),
    );
    const content = await storage.readJSONFile(filePath);
    expect(content).toEqual({ key: 'value' });
  });
  it('should handle file not found error from reading a file', async () => {
    mockedFsPromises.readFile.mockRejectedValue(notFoundError);
    await expect(storage.readJSONFile(filePath)).rejects.toThrow(
      'File not found: ' + filePath,
    );
  });
  it('should handle other errors from reading a JSON file', async () => {
    mockedFsPromises.readFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.readJSONFile(filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
});
describe('validateFile', () => {
  it('should validate a file successfully', async () => {
    mockedFsPromises.access.mockResolvedValue(undefined as never);
    const result = await storage.validateFile(filePath);
    expect(result).toBe(true);
  });
  it('should fail to validate a file', async () => {
    mockedFsPromises.access.mockRejectedValue(undefined as never);
    const result = await storage.validateFile(filePath);
    expect(result).toBe(false);
  });
});
