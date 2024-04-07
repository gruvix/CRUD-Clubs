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
