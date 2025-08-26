import { AgendamentoService } from "../service/AgendamentoService";

const service = new AgendamentoService();

export const marcarAgendamento = async (event: { body: string; }) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const dto = body?.agendamento;

    const agendamento = await service.marcarAgendamento(dto);

    return {
      statusCode: 201,
      body: JSON.stringify({
        mensagem: "Agendamento realizado com sucesso",
        agendamento,
      }),
    };
  } catch (err: any) {
    console.error("Erro ao marcar agendamento:", err?.message || err);

    const msg = String(err?.message || "Erro interno");
    const statusCode =
      msg.includes("inválido") ? 400 :
      msg.includes("Horário indisponível") ? 422 :
      msg.includes("já reservado") ? 409 :
      msg.includes("Médico não encontrado") ? 404 : 500;

    return {
      statusCode,
      body: JSON.stringify({ mensagem: msg }),
    };
  }
};
