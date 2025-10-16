// +String id
//         +String marca
//         +String modelo
//         +boolean status
//         +String placa
//         +double quilometragem
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVeiculo extends Document {
  _id: string;
  marca: string;
  modelo: string;
  placa: string;
  status: string;
  numSerie: string;
}

const EquipSchema: Schema<IVeiculo> = new Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  placa: { type: String, required: true },
  numSerie: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["ativo", "inativo", "manutencao"],
    default: "ativo",
  },
});

const Equipamento: Model<IVeiculo> =
  mongoose.models.Equipamento ||
  mongoose.model<IVeiculo>("Equipamento", EquipSchema);

export default Equipamento;
