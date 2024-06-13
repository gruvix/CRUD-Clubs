const mockRepository = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  manager: {
    transaction: jest.fn(),
    save: jest.fn(),
  },
  createQueryBuilder: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  save: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis(),
};

export default mockRepository;
