// app/api/veiculos/route.ts
import {
  createVeiculo,
  getAllVeiculos,
} from "@/controllers/veiculoController";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAllVeiculos();
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newVeiculo = await createVeiculo(data);
    return NextResponse.json({ success: true, data: newVeiculo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}