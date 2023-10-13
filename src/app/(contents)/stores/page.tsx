'use client'
import { useRouter } from "../../../../node_modules/next/navigation"
import { useState, useEffect } from "react"
import axios from "../../../../node_modules/axios/index"

const Stores = () => {

    const router = useRouter()

    const [stores, setStores] = useState(null)

    useEffect(() => {
        const func = async () => {
            const { data } = await axios.get('../../api/stores')
            setStores(data)
        }
        func()
    }, [])

    if (!stores) return null
    
    return (
      <div className="flex flex-row w-full h-full">
          {stores.map((value, idx) => (
              <div style={{ backgroundImage: `url(${value.url})` }} onClick={() => router.push(`stores/${value.id}`)} className="flex hover:opacity-50 flex-1 h-[50%] p-1 m-3 font-bold bg-gray-400 bg-cover rounded-lg hover:bg-slate-300 hover:border-4 hover:border-black basis-1/3" key={idx}>
                  <div className="flex items-center justify-center w-full h-full text-xl opacity-0 hover:opacity-100 transition-opacity">
                      Visit Store
                  </div>
              </div>
          ))}
      </div>
    )



}

export default Stores
