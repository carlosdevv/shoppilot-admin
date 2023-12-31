import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
