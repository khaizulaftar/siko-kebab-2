"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Link from 'next/link'
import ChartIncome from '../trafik/chart'
import Menu from './menu'
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from './loading'
import DownloadPdf from '../pdf/downloadPdf'
import NonTunai from './nonTunai'

export default function Dashboard() {

    const [showPemasukan, setShowPemasukan] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            router.push("/login")
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    const { data: dataPemasukan = {}, mutate: refreshIncome } = useSWR("/api/income",
        url => axios.get(url).then(res => res.data.data).finally(() => setIsLoading(false)),
        { refreshInterval: 3000 }
    )

    const { data: stock = [], mutate: refreshStock } = useSWR("/api/stockSet",
        url => axios.get(url).then(res => res.data).finally(() => setIsLoading(false)),
    )

    if (!isAuthenticated || isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 min-h-screen">
                {/* jumlah pemasukan */}
                <div className="card px-6 pt-6 rounded-3xl shadow-sm my-4 bg-[url('/images/stacked-waves-haikei.svg')] bg-cover bg-center">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <img src="/images/siko kebab.png" alt="logo" className="w-10 mx-auto" />
                        </div>
                        <span className='text-xs text-gray-100'>{dataPemasukan.tanggal}</span>
                    </div>
                    <div className='flex items-center justify-between mb-12'>
                        <div className='flex items-center gap-2'>
                            {showPemasukan ? <span className="text-3xl font-bold text-white">Rp{new Intl.NumberFormat('id-ID').format(Number(dataPemasukan?.total_pemasukan) || 0)}</span> : <span className='text-3xl font-bold text-white'>. . . . . .</span>}
                            <button onClick={() => setShowPemasukan(!showPemasukan)}>
                                {showPemasukan ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                }
                            </button>
                        </div>
                        <DownloadPdf />
                    </div>
                    <div className='flex gap-6 items-center mb-4'>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-semibold">Tunai</span>
                            {showPemasukan ? <span className="text-sm text-white font-semibold">Rp{new Intl.NumberFormat('id-ID').format(Number(dataPemasukan?.total_tunai) || 0)}</span> : <span className='text-sm font-bold text-white'>. . . . . .</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-semibold">Non tunai</span>
                            {showPemasukan ? <span className="text-sm text-white font-semibold">Rp{new Intl.NumberFormat('id-ID').format(Number(dataPemasukan?.total_non_tunai) || 0)}</span> : <span className='text-sm font-bold text-white'>. . . . . .</span>}
                        </div>
                    </div>
                    <NonTunai />
                </div>

                {/* menu terjual  */}
                <div className="my-4">
                    <div className='flex flex-col sm:grid grid-cols-3 gap-6'>
                        <div className="grid grid-cols-3 sm:flex flex-col gap-4">
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei1.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_kebab}</span>
                                <span className="text-sm text-white font-semibold">Kebab</span>
                            </div>
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei1.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_burger}</span>
                                <span className="text-sm text-white font-semibold">Burger</span>
                            </div>
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei2.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_minuman}</span>
                                <span className="text-sm text-white font-semibold">Minuman</span>
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <div className="flex items-center justify-between mb-6">
                                <div></div>
                                <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                                    href="/trafik">
                                    <span className="absolute -end-full transition-all group-hover:end-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                    <span className="text-sm transition-all group-hover:me-4">Lihat semua</span>
                                </Link>
                            </div>
                            <ChartIncome jumlahHari={7} />
                        </div>
                    </div>
                </div>

                {/* jumlah bahan */}
                <div className="my-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-md text-[#B12D67]">Jumlah bahan</span>
                        </div>
                        <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                            href="/stock">
                            <span className="absolute -end-full transition-all group-hover:end-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                            <span className="text-sm transition-all group-hover:me-4">Lihat semua</span>
                        </Link>
                    </div>
                    <div className="grid grid-1 sm:grid-cols-2 gap-3">
                        {stock.slice(0, 4).map((value, index) => (
                            <div key={index} className="p-6 rounded-3xl shadow-sm flex items-center justify-between bg-white">
                                <span className="capitalize text-gray-600 text-md font-semibold">{value.name}</span>
                                <div className='flex items-center gap-1'>
                                    <span className="text-md text-[#B12D67] font-semibold">{value.stock}</span>
                                    <span className="text-md text-[#B12D67] font-semibold">|</span>
                                    <span className="text-md text-[#B12D67] font-semibold">{value.dose}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* menu */}
                <Menu />
            </div>
        </>
    )
}