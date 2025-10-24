// src/models/Veiculo.ts
import mongoose, { Schema, model, Document } from "mongoose";

export interface IVeiculo extends Document {
  placa: string;
  marca: string; // <-- ADICIONADO
  modelo: string;
  ano: number;
  kmAtual: number;
  kmUltimaManutencao: number;
  status: "OK" | "Em Manutenção";
}

const VeiculoSchema = new Schema<IVeiculo>({
  placa: { type: String, required: true, unique: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  kmAtual: { type: Number, required: true, default: 0 },
  kmUltimaManutencao: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["OK", "Em Manutenção"],
    required: true,
    default: "OK",
  },
});

export default mongoose.models.Veiculo || model<IVeiculo>("Veiculo", VeiculoSchema);