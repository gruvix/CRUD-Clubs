const mockRepository = {
  findOneBy: jest.fn(),
  manager: {
    transaction: jest.fn(),
    save: jest.fn(),
  }
};

export default mockRepository;
