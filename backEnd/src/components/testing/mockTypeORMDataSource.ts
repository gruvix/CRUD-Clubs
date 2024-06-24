const queryRunner = {
  connect: jest.fn().mockReturnThis(),
  startTransaction: jest.fn().mockReturnThis(),
  commitTransaction: jest.fn().mockReturnThis(),
  rollbackTransaction: jest.fn().mockReturnThis(),
  release: jest.fn().mockReturnThis(),
  manager: {
    save: jest.fn(),
  },
};
const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(queryRunner),
};

export {mockDataSource, queryRunner};
