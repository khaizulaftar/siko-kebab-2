"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import ChartIncome from "./chart"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from '../dashboard/loading'

export default function Trafik() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [dataPemasukan, setDataPemasukan] = useState({
        total_kebab: [],
        total_burger: [],
        total_minuman: [],
    })

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            router.push("/login")
        } else {
            setIsAuthenticated(true)
        }
        
        axios.get("/api/trafik")
            .then(response => (setDataPemasukan(response.data.data)))
    }, [router])

    const getHariColor = (hari) => {

        if (hari === "Min") return "text-red-500"
        if (hari === "Jum") return "text-yellow-500"
        return "text-gray-600"
    }

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <>
            <div className="max-w-4xl mx-auto min-h-screen">
                <div className="mx-4 mt-6 sm:mb-6 mb-24">
                    <ChartIncome jumlahHari={14} />
                    <div className="my-6 grid sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-white rounded-3xl shadow-sm">
                            <h2 className="text-md font-semibold text-[#B12D67] mb-4 text-center capitalize">trafik kebab</h2>
                            <div className="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 p-1">
                                <div className="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div className="flex gap-3 items-end justify-center w-full flex-wrap">
                                    {
                                        dataPemasukan.total_kebab.slice(-7).map((value, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center relative mt-6">
                                                <span className="text-sm absolute -top-6 text-gray-600">{value}</span>
                                                <span className="w-6 bg-blue-500" style={{ height: `${value}px` }}></span>
                                                <span className={`text-xs capitalize ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-3xl shadow-sm">
                            <h2 className="text-md font-semibold text-[#B12D67] mb-4 text-center capitalize">trafik burger</h2>
                            <div className="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 p-1">
                                <div className="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div className="flex gap-3 items-end justify-center w-full flex-wrap">
                                    {
                                        dataPemasukan.total_burger.slice(-7).map((value, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center relative mt-6">
                                                <span className="text-sm absolute -top-6 text-gray-600">{value}</span>
                                                <span className="w-6 bg-blue-500" style={{ height: `${value}px` }}></span>
                                                <span className={`text-xs capitalize ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-3xl shadow-sm">
                            <h2 className="text-md font-semibold text-[#B12D67] mb-4 text-center capitalize">trafik minuman</h2>
                            <div className="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 p-1">
                                <div className="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div className="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div className="flex gap-3 items-end justify-center w-full flex-wrap">
                                    {
                                        dataPemasukan.total_minuman.slice(-7).map((value, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center relative mt-6">
                                                <span className="text-sm absolute -top-6 text-gray-600">{value}</span>
                                                <span className="w-6 bg-blue-500 transition-all duration-500" style={{ height: `${value}px` }}></span>
                                                <span className={`text-xs capitalize ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}