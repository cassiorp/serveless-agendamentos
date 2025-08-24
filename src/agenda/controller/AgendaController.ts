import { AgendaService } from "../service/AgendaService";

const service = new AgendaService();

export const buscarAgendas = async () => {
  try {
    const result = await service.buscarAgendas();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Erro ao buscar agendas", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao buscar agendas" }),
    };
  }
};
