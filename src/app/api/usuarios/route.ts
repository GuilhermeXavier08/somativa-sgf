import {
  createUsuario,
  getAllUsuarios,
} from "@/controllers/usuarioController";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    const data = await getAllUsuarios();
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newUsuario = await createUsuario(data);
    return NextResponse.json({ success: true, data: newUsuario });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}