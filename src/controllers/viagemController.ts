import Viagem, { IViagem } from "@/models/Viagem";
import connectMongo from "@/services/mongodb";

export const getAllViagens = async () => {
  await connectMongo();
  const viagens = await Viagem.find([])
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");
  return viagens;
};

export const getOneViagem = async (id: string) => {
  await connectMongo();
  const viagem = await Viagem.findById(id)
    .populate("idMotorista", "nome email")
    .populate("idVeiculo", "placa modelo");
  return viagem;
};

export const createViagem = async (data: Partial<IViagem>) => {
  await connectMongo();
  const novaViagem = new Viagem(data);
  const novaViagemId = novaViagem.save();
  return novaViagemId;
};

export const updateViagem = async (id: string, data: Partial<IViagem>) => {
  await connectMongo();
  const viagemAtualizada = await Viagem.findByIdAndUpdate(id, data, {
    new: true,
  });
  return viagemAtualizada;
};

export const deleteViagem = async (id: string) => {
  await connectMongo();
  await Viagem.findByIdAndDelete(id);
};