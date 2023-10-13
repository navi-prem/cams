import { prisma } from "../../../../prisma/prisma.js"
import {NextResponse} from "../../../../node_modules/next/server"

export async function GET() {
    const data = await prisma.stores.findMany()
    return NextResponse.json(data)
}
