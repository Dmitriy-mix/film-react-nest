import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('логирует сообщение в формате JSON', () => {
    const logger = new JsonLogger();
    logger.log('hello', 'extra');

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'hello',
        optionalParams: ['extra'],
      }),
    );
  });

  it('логирует ошибку через console.error', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const logger = new JsonLogger();
    logger.error('fail');

    expect(errorSpy).toHaveBeenCalledWith(
      JSON.stringify({ level: 'error', message: 'fail', optionalParams: [] }),
    );
    errorSpy.mockRestore();
  });
});
