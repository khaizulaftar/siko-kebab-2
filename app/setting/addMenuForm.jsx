import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"

export default function AddMenuForm({ onMenuAdded }) {
    const [ingredients, setIngredients] = useState([])

    useEffect(() => {
        axios.get("/api/stockSet")
            .then(res => setIngredients(res.data))
            .catch(() => Swal.fire("Error", "Gagal mengambil data bahan", "error"))
    }, [])

    const handleAddMenu = async () => {
        const { value, isConfirmed } = await Swal.fire({
            title: "Tambah Menu",
            width: "600px",
            html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <input id="name" class="swal2-input" placeholder="Nama Menu">
                    <input id="price" type="text" class="swal2-input" placeholder="Harga" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')">
                    <select id="category" class="swal2-select">
                        <option value="kebab">Kebab</option>
                        <option value="burger">Burger</option>
                        <option value="minuman">Minuman</option>
                    </select>
                    <select id="dose" class="swal2-select">
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                        <option value="slice">slice</option>
                        <option value="bh">bh</option>
                        <option value="sached">sached</option>
                        <option value="potong">potong</option>
                        <option value="helai">helai</option>
                        <option value="bungkus">bungkus</option>
                        <option value="botol">botol</option>
                        <option value="gelas">gelas</option>
                        <option value="lembar">lembar</option>
                        <option value="sdm">sdm</option>
                        <option value="sdt">sdt</option>
                    </select>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <select id="ingredient" class="swal2-select">
                            <option value="">Pilih Bahan</option>
                            ${ingredients.map(ing => `<option value="${ing.name}">${ing.name}</option>`).join('')}
                        </select>
                        <input id="qty" type="number" class="swal2-input" placeholder="Jumlah">
                        <button type="button" id="addIngredient" class="swal2-confirm swal2-styled">Tambah Bahan</button>
                    </div>
                    <p class="text-md text-gray-500 mt-2">Nama Menu Uppercase contoh "Nama Menu"</p>
                    <div id="composition-list" style="max-height: 200px; overflow-y: auto;"></div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
            didOpen: () => {
                const compList = document.getElementById("composition-list")
                const selectedComps = {}

                document.getElementById("addIngredient").addEventListener("click", () => {
                    const ing = document.getElementById("ingredient").value
                    const qty = parseFloat(document.getElementById("qty").value) || 0

                    if (!ing || qty <= 0) return
                    selectedComps[ing] = qty

                    compList.innerHTML = Object.entries(selectedComps).map(([key, val]) => `
                        <div style="display: flex; justify-content: space-between; padding: 5px; background: #f3f3f3; border-radius: 5px; margin-bottom: 5px;">
                            <span>${key}</span>
                            <span>${val}</span>
                        </div>
                    `).join("")
                })
            },
            preConfirm: () => {
                const name = document.getElementById("name").value.trim()
                const price = document.getElementById("price").value.replace(/\./g, "")

                // Validasi input
                if (!name || !price) {
                    Swal.showValidationMessage("Nama & harga harus diisi!")
                    return false
                }

                const composition = {}
                document.querySelectorAll("#composition-list div").forEach(div => {
                    const [key, val] = div.innerText.split("\n")
                    composition[key] = parseFloat(val)
                })

                // Validasi bahan
                if (Object.keys(composition).length === 0) {
                    Swal.showValidationMessage("Bahan harus diisi!")
                    return false
                }

                return {
                    name,
                    price: parseInt(price, 10),
                    category: document.getElementById("category").value,
                    dose: document.getElementById("dose").value,
                    composition
                }
            }
        })

        if (!isConfirmed) return

        if (!value || Object.keys(value.composition).length === 0) {
            return Swal.fire("Error", "Minimal satu bahan harus diisi!", "error")
        }

        axios.post("/api/menuSet", value)
            .then(res => {
                Swal.fire("Berhasil", "Menu berhasil ditambahkan", "success")
                onMenuAdded(res.data)

                axios.post("/api/history", {
                    totalHarga: Number(value.price),
                    item: null,
                    keterangan: "menu baru",
                    category: value.category,
                    nama: value.name,
                    icon: "https://img.icons8.com/bubbles/100/menu.png"
                })
            })
            .catch(() => Swal.fire("Error", "Gagal menambahkan menu", "error"))
    }

    return (
        <div className="mx-4 flex justify-end mt-1">
            <button
                onClick={handleAddMenu}
                className="flex items-center gap-1 px-4 py-2 bg-blue-100 border border-blue-500 text-sm text-blue-600 rounded-full hover:bg-blue-200 transition-all"
            >
                <span>Tambah menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    )
}