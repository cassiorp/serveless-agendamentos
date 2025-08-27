import { marcarAgendamento } from "../controller/AgendamentoController";
import { AgendamentoService } from "../service/AgendamentoService";

describe("AgendamentoController.marcarAgendamento", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const event = (body: any) => ({ body: JSON.stringify(body) });

  it("retorna 201 e o agendamento quando o service resolve", async () => {
    const dto = { id: 1, medico: "Dr. João Silva", paciente: "Carlos Almeida", dataHorario: "2024-10-05 09:00" };
    const result = { ...dto };
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockResolvedValueOnce(result as any);

    const resp = await marcarAgendamento(event({ agendamento: dto }));

    expect(resp.statusCode).toBe(201);
    const body = JSON.parse(resp.body);
    expect(body.mensagem).toBe("Agendamento realizado com sucesso");
    expect(body.agendamento).toEqual(result);
  });

  it("retorna 400 quando payload é inválido", async () => {
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockRejectedValueOnce(new Error("Payload inválido: id, medico, paciente e data_horario são obrigatórios."));
    const resp = await marcarAgendamento(event({ agendamento: {} }));

    expect(resp.statusCode).toBe(400);
    expect(JSON.parse(resp.body)).toEqual({ mensagem: "Payload inválido: id, medico, paciente e data_horario são obrigatórios." });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("retorna 422 quando horário indisponível", async () => {
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockRejectedValueOnce(new Error("Horário indisponível para este médico."));
    const resp = await marcarAgendamento(event({ agendamento: { id: 1, medico: "Dr. João", paciente: "A", dataHorario: "2024-10-05 08:00" } }));
    expect(resp.statusCode).toBe(422);
    expect(JSON.parse(resp.body)).toEqual({ mensagem: "Horário indisponível para este médico." });
  });

  it("retorna 409 quando horário já reservado", async () => {
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockRejectedValueOnce(new Error("Horário já reservado."));
    const resp = await marcarAgendamento(event({ agendamento: { id: 1, medico: "Dr. João", paciente: "A", dataHorario: "2024-10-05 09:00" } }));
    expect(resp.statusCode).toBe(409);
    expect(JSON.parse(resp.body)).toEqual({ mensagem: "Horário já reservado." });
  });

  it("retorna 404 quando médico não encontrado", async () => {
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockRejectedValueOnce(new Error("Médico não encontrado."));
    const resp = await marcarAgendamento(event({ agendamento: { id: 999, medico: "N/A", paciente: "A", dataHorario: "2024-10-05 09:00" } }));
    expect(resp.statusCode).toBe(404);
    expect(JSON.parse(resp.body)).toEqual({ mensagem: "Médico não encontrado." });
  });

  it("retorna 500 para erro genérico", async () => {
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockRejectedValueOnce(new Error("Falha interna"));
    const resp = await marcarAgendamento(event({ agendamento: { id: 1, medico: "Dr. João", paciente: "A", dataHorario: "2024-10-05 09:00" } }));
    expect(resp.statusCode).toBe(500);
    expect(JSON.parse(resp.body)).toEqual({ mensagem: "Falha interna" });
  });

  it("aceita event.body já como objeto", async () => {
    const dto = { id: 1, medico: "Dr. João", paciente: "A", dataHorario: "2024-10-05 09:00" };
    jest.spyOn(AgendamentoService.prototype, "marcarAgendamento").mockResolvedValueOnce(dto as any);
    // @ts-expect-error forçando tipo para simular objeto direto
    const resp = await marcarAgendamento({ body: { agendamento: dto } });
    expect(resp.statusCode).toBe(201);
  });
});
