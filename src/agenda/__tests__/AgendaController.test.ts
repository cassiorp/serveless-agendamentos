import { buscarAgendas } from '../controller/AgendaController';
import { AgendaService } from '../service/AgendaService';

describe('AgendaController.buscarAgendas', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('deve retornar 200 e o body com o resultado do service', async () => {
    
    const fakeResult = { medicos: [{ id: 1, nome: 'Dr. João' }] };
    jest
      .spyOn(AgendaService.prototype, 'buscarAgendas')
      .mockResolvedValueOnce(fakeResult as any);

    const resp = await buscarAgendas();

    expect(resp.statusCode).toBe(200);
    expect(typeof resp.body).toBe('string');

    const parsed = JSON.parse(resp.body);
    expect(parsed).toEqual(fakeResult);
  });

  it('deve retornar 500 quando o service lançar erro e logar o erro', async () => {
    const err = new Error('falhou geral');
    jest
      .spyOn(AgendaService.prototype, 'buscarAgendas')
      .mockRejectedValueOnce(err);

    const resp = await buscarAgendas();

    expect(resp.statusCode).toBe(500);
    const parsed = JSON.parse(resp.body);
    expect(parsed).toEqual({ message: 'Erro interno ao buscar agendas' });

    expect(consoleErrorSpy).toHaveBeenCalled();
    const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
    expect(lastCall?.[0]).toBe('Erro ao buscar agendas');
  });
});
