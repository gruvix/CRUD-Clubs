import * as storage from '../dataStorage';
jest.mock('fs/promises');
import * as fsPromises from 'fs/promises';

const mockedFsPromises = fsPromises as jest.Mocked<typeof fsPromises>;

const filePath = '/path/to/file';
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
    mockedFsPromises.copyFile.mockImplementation(() => {
      const error = new Error('ENOENT: no such file or directory, copyFile');
      (error as any).code = 'ENOENT';
      return Promise.reject(error);
    });
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
    expect(mockedFsPromises.writeFile).toHaveBeenCalledWith(filePath, 'content');
  });
  it('should handle other errors from writing a file', async () => {
    mockedFsPromises.writeFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.writeFile(filePath, filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
})
describe('readFile', () => {
  it('should read a file successfully', async () => {
    mockedFsPromises.readFile.mockResolvedValue(Buffer.from('content'));
    const content = await storage.readFile(filePath);
    expect(content).toEqual(Buffer.from('content'));
  });
  it('should handle other errors from reading a file', async () => {
    mockedFsPromises.readFile.mockRejectedValue(new Error('Simulated Error'));
    await expect(storage.readFile(filePath)).rejects.toThrow(
      'Simulated Error',
    );
  });
});
