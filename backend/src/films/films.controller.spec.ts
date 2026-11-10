import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    getAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('возвращает список фильмов', async () => {
    const films = [{ id: '1', title: 'Test' }];
    mockFilmsService.getAll.mockResolvedValue(films);

    const result = await controller.getAll();
    expect(result).toEqual(films);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('возвращает фильм по id с расписанием', async () => {
    const film = { id: '1', title: 'Test', schedule: [{ id: 's1' }] };
    mockFilmsService.getSchedule.mockResolvedValue(film);

    const result = await controller.getSchedule('1');
    expect(result).toEqual(film);
    expect(service.getSchedule).toHaveBeenCalledWith('1');
  });
});