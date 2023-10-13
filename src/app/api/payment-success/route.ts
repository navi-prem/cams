import {NextRequest, NextResponse} from "../../../../node_modules/next/server";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: NextRequest) {
    const orderx = await req.json()
    for ( const order of orderx ) {
        const value = await prisma.dish.findUnique({
            where: {
                name: order.name
            }
        })
        const newQuantity = value.quantity - order.count
        await prisma.dish.update({
            where: {
                name: order.name
            },
            data: {
                quantity: newQuantity
            }
        })
    }
    const value = orderx.map(order => ({ name: order.name , quantity: order.count , store: order.storeId}))
    const newOrder = await prisma.user.create({
        data: {
            orders: {
                create: value
            },
            store: orderx[0].storeId
        },
        include: {
            orders: true
        }
    })
    return NextResponse.json(newOrder)
}
