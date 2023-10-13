import Razorpay from "razorpay"
import { NextRequest, NextResponse } from "../../../node_modules/next/server";

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

export async function POST(req: NextRequest) {
    const { amount, currency } = await req.json()
    const order = await instance.orders.create({
          amount,
          currency
        }
    )
    return NextResponse.json(order)
}
