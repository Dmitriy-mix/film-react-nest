import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  it('разделяет поля табуляцией и добавляет перенос строки', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new TskvLogger();
    logger.log('hello', 'extra');

    const output = spy.mock.calls[0][0];
    expect(output).toContain('level=log');
    expect(output).toContain('message=hello');
    expect(output).toContain('\t');
    expect(output.endsWith('\n')).toBe(true);

    spy.mockRestore();
  });
});
