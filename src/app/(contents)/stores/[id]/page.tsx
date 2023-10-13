'use client'
import ErrorIcon from '@mui/icons-material/Error';
import { useState, useEffect } from "react"
import axios from "../../../../../node_modules/axios/index"

const Id = ({ params: {id} }: { params : { id: string } }) => {
    const [ allItems , setAll ] = useState([])
    const [ red , setRed ] = useState(false)
    const [oid, setOid] = useState('')

    const handleRazorpay = async (e, amount) => {

        if ( amount == 0 ) {
            setRed(true)
            setTimeout(() => {
                setRed(false)
            },1000)
            return
        }

        e.preventDefault()
        const {data} = await axios.post("../../../api", {
            amount: amount * 100,
            currency: "INR"
        })

        console.log(data)
        const options = {
            key: process.env.KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: 'Transaction',
            description: 'Summa Transaction',
            order_id: data.id,
            handler: async function (response) {
                const result = allItems.filter(item => item.count > 0)
                const { data } = await axios.post('../api/payment-success', result )
                setOid(data.id)
            },
            theme: {
                color: '##2563eb',
            },
        }
        
        const ins = new Razorpay(options)
        ins.open()
    }


    useEffect(()=> {
        const func = async () => {
            const { data } = await axios.get(`../../../api/stores/${id}`)
            const items = data.map(item => 
                    {
                    return {...item, count: 0}
                    }
                    )
            setAll(items)
        }
        if(id) func()
    },[id])

  return (
  <>
    <div className="flex flex-row h-[300px] justify-around">
        {allItems.length === 0 ? "There are no items to display" : (
            allItems.map((value, idx) => (
                <div style={{ backgroundImage: `url(${value.url})` }} className="flex-wrap flex-1 h-full p-1 m-3 font-bold bg-gray-400 bg-cover rounded-lg hover:bg-slate-300 hover:border-4 hover:border-blue-400 basis-1/3" key={idx}>{value.name} <p className="font-medium">{'₹'} {value.price}</p>
                <button className="px-2 py-1 text-white bg-black rounded-md hover:bg-slate-600" onClick={() => {
                    if ( value.count != 0 ) value.count -= 1;
                    setAll([...allItems])
                }}>-</button>
                {' '}{value.count}{' '}
                <button className="px-2 py-1 text-white bg-black rounded-md hover:bg-slate-600" onClick={() => {
                    if ( value.count != value.quantity ) value.count += 1;
                    setAll([...allItems])
                }}>+</button>
                </div>
                ))
            )}
    </div>
    <br/><br/>
    <div className="flex justify-center">
    <button className="px-2 py-1 text-white bg-black rounded-full hover:bg-slate-600" onClick={(e) => handleRazorpay(e, allItems.map(i => i.price * i.count).reduce((i, tot) => i + tot, 0))}>Checkout</button>
    </div>
    <br/>
    {oid === '' ? "" : <div className="flex justify-center">
    <p className="font-bold">Your order id: <button onClick={() => navigator.clipboard.writeText(oid)}>{oid}</button></p>
    </div>}
    { red && (
        <div className="flex justify-center text-red-500">
        <ErrorIcon/>
        <p className="font-bold">&nbsp;Please choose some porduct.</p>
        </div>)

    }
  </>
  )

}

export default Id
