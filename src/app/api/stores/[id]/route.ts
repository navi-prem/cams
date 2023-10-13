import { NextRequest, NextResponse } from "../../../../../node_modules/next/server";
import {prisma} from "../../../../../prisma/prisma";

export async function GET(req: NextRequest) {
    const storeId = Number(req.nextUrl.pathname.slice(12))
    const data = await prisma.dish.findMany({
        where: {
            storeId,
        }
    })
    return NextResponse.json(data)
}
