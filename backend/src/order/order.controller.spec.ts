import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: mockOrderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => jest.clearAllMocks());

  it('создаёт заказ и возвращает результат', async () => {
    const dto: OrderDto = {
      email: 'user@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: '1',
          session: '2',
          daytime: '2026-11-10T18:00:00',
          row: 1,
          seat: 1,
          price: 500,
        },
      ],
    };
    const expected = {
      total: 1,
      items: [{ ...dto.tickets[0], id: 'uuid' }],
    };
    mockOrderService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(result).toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});