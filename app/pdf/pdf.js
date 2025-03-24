"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica", color: "#333" },
    header: { textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    summary: { marginBottom: 20, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 6 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    summaryText: { fontSize: 12, fontWeight: "bold" },
    summaryValue: { fontSize: 16, fontWeight: "bold", color: "#22c55e" },
    dateText: { fontSize: 10, color: "gray", textAlign: "right" },
    sectionTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 5, borderBottom: "1px solid #ddd", paddingBottom: 2 },
    table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#ddd", borderRadius: 4, overflow: "hidden" },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", backgroundColor: "#fff" },
    headerRow: { backgroundColor: "#f0f0f0", fontSize: 12, fontWeight: "bold" }, // Header tabel lebih besar dari isi tabel
    cellHeader: { flex: 1, padding: 6, textAlign: "center", fontWeight: "bold" },
    cell: { flex: 1, padding: 4, textAlign: "center", fontSize: 10 }, // Isi tabel tetap kecil
})

const MyDocument = ({ data1, data2, data3, role}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Laporan Harian</Text>

            {/* Ringkasan Pemasukan */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Tanggal:</Text>
                    <Text style={styles.dateText}>{data2?.tanggal || "-"}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Jumlah Pemasukan:</Text>
                    <Text style={styles.summaryValue}>Rp{(Number(data2?.total_pemasukan) || 0).toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Tunai:</Text>
                    <Text style={styles.summaryValue}>Rp{(Number(data2?.total_tunai) || 0).toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Non tunai:</Text>
                    <Text style={styles.summaryValue}>Rp{(Number(data2?.total_non_tunai) || 0).toLocaleString()}</Text>
                </View>
            </View>

            {/* total */}
            <Text style={styles.sectionTitle}>Jumlah Habis</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cellHeader}>Kebab</Text>
                    <Text style={styles.cellHeader}>Burger</Text>
                    <Text style={styles.cellHeader}>Minuman</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>{data2.total_kebab}</Text>
                    <Text style={styles.cell}>{data2.total_burger}</Text>
                    <Text style={styles.cell}>{data2.total_minuman}</Text>
                </View>
            </View>

            {/* Tabel Pemasukan */}
            <Text style={styles.sectionTitle}>Detail History</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cellHeader}>Nama</Text>
                    <Text style={styles.cellHeader}>Kategori</Text>
                    <Text style={styles.cellHeader}>item</Text>
                    <Text style={styles.cellHeader}>Keterangan</Text>
                    <Text style={styles.cellHeader}>Jumlah</Text>
                </View>
                {data1?.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.category}</Text>
                        <Text style={styles.cell}>{item.total_item}</Text>
                        <Text style={styles.cell}>{item.keterangan}</Text>
                        <Text style={styles.cell}>Rp {item.jumlah_pemasukan}</Text>
                    </View>
                ))}
            </View>

            <View style={{ marginTop: 10 }} />

            {/* Tabel Stok Bahan */}
            <Text style={styles.sectionTitle}>Detail Stok Bahan</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cellHeader}>Nama</Text>
                    <Text style={styles.cellHeader}>Stok Sekarang</Text>
                    <Text style={styles.cellHeader}>Stok Awal</Text>
                    <Text style={styles.cellHeader}>Masuk</Text>
                    <Text style={styles.cellHeader}>Habis</Text>
                </View>
                {data3?.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.stock} / {item.dose}</Text>
                        <Text style={styles.cell}>{item.initial_stock} / {item.dose}</Text>
                        <Text style={styles.cell}>{item.final_stock} / {item.dose}</Text>
                        <Text style={styles.cell}>{item.out_stock} / {item.dose}</Text>
                    </View>
                ))}
            </View>

            {role === "admin" && (
                <>
                    <Text style={styles.sectionTitle}>Detail Harga Stok Bahan</Text>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.headerRow]}>
                            <Text style={styles.cellHeader}>Nama</Text>
                            <Text style={styles.cellHeader}>Harga</Text>
                            <Text style={styles.cellHeader}>Harga Masuk</Text>
                            <Text style={styles.cellHeader}>Harga Keluar</Text>
                            <Text style={styles.cellHeader}>Selisih</Text>
                        </View>
                        {data3?.map((item, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.cell}>{item.name}</Text>
                                <Text style={styles.cell}>Rp{item.price.toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{(item.price * item.stock).toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{(item.out_stock * item.price).toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{((item.stock - item.out_stock) * item.price).toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </Page>
    </Document>
)

export default MyDocument