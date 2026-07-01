import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes, FaFileSignature, FaSpinner, FaCopy } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { templateService } from '../services'

const PARTNERS = [
  { code: '01', name: 'Agus' },
  { code: '02', name: 'Ajar' },
  { code: '03', name: 'Ariyanto' },
  { code: '04', name: 'Arfanto' },
  { code: '05', name: 'Mahendra' },
  { code: '06', name: 'Yos Rinaldo' }
]

const formatIndonesianDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const terbilangIndonesian = (num) => {
  const number = Math.floor(num)
  if (number === 0) return 'Nol'

  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ]

  const helper = (n) => {
    let temp = ''
    if (n < 12) {
      temp = ' ' + bilangan[n]
    } else if (n < 20) {
      temp = helper(n - 10) + ' Belas'
    } else if (n < 100) {
      temp = helper(Math.floor(n / 10)) + ' Puluh' + helper(n % 10)
    } else if (n < 200) {
      temp = ' Seratus' + helper(n - 100)
    } else if (n < 1000) {
      temp = helper(Math.floor(n / 100)) + ' Ratus' + helper(n % 100)
    } else if (n < 2000) {
      temp = ' Seribu' + helper(n - 1000)
    } else if (n < 1000000) {
      temp = helper(Math.floor(n / 1000)) + ' Ribu' + helper(n % 1000)
    } else if (n < 1000000000) {
      temp = helper(Math.floor(n / 1000000)) + ' Juta' + helper(n % 1000000)
    } else if (n < 1000000000000) {
      temp = helper(Math.floor(n / 1000000000)) + ' Milyar' + helper(Math.floor(n % 1000000000))
    }
    return temp
  }

  return helper(number).trim() + ' Rupiah'
}

const formatRupiah = (numberString) => {
  const num = parseInt(numberString.replace(/\D/g, ''), 10)
  if (isNaN(num)) return ''
  return 'Rp ' + num.toLocaleString('id-ID')
}

const GenerateProposalModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    tanggalRaw: new Date().toISOString().split('T')[0],
    nomor_surat_seq: '001',
    partner_code: '01',
    perihal_proposal: '',
    nama_perusahaan: '',
    alamat_perusahaan: '',
    salutation: 'Bapak',
    nama_client: '',
    jabatan: '',
    periode_tahun_buku: new Date().getFullYear().toString(),
    nominal_uang_raw: '50000000',
    nominal_dalam_alphabet: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto calculate letter number and text representations
  const generatedData = useMemo(() => {
    const dateObj = new Date(formData.tanggalRaw || new Date())
    const monthCode = String(dateObj.getMonth() + 1).padStart(2, '0')
    const yearCode = String(dateObj.getFullYear()).substring(2)

    const sequenceCode = formData.nomor_surat_seq.padStart(3, '0')
    const partnerCode = formData.partner_code

    const nomorSurat = `${sequenceCode}/01.${partnerCode}.${monthCode}${yearCode}/WS`
    const tanggalIndo = formatIndonesianDate(formData.tanggalRaw)

    return {
      nomorSurat,
      tanggalIndo
    }
  }, [formData.tanggalRaw, formData.nomor_surat_seq, formData.partner_code])

  // Automatically update alphabet words when nominal raw changes
  useEffect(() => {
    const num = parseInt(formData.nominal_uang_raw, 10)
    if (!isNaN(num)) {
      setFormData(prev => ({
        ...prev,
        nominal_dalam_alphabet: terbilangIndonesian(num)
      }))
    }
  }, [formData.nominal_uang_raw])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Proposal Title is required')
      return
    }

    if (!formData.nama_perusahaan.trim()) {
      toast.error('Company Name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        tanggal: generatedData.tanggalIndo,
        nomor_surat: generatedData.nomorSurat,
        perihal_proposal: formData.perihal_proposal,
        nama_perusahaan: formData.nama_perusahaan,
        alamat_perusahaan: formData.alamat_perusahaan,
        salutation: formData.salutation,
        nama_client: formData.nama_client,
        jabatan: formData.jabatan,
        periode_tahun_buku: formData.periode_tahun_buku,
        nominal_uang: formatRupiah(formData.nominal_uang_raw),
        nominal_dalam_alphabet: formData.nominal_dalam_alphabet
      }

      const response = await templateService.generateProposal(payload)
      
      // Handle file download
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `${formData.title}.docx`
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      window.document.body.removeChild(a)

      toast.success('Proposal generated and downloaded successfully')

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Failed to generate proposal:', err)
      toast.error(err.response?.data?.message || 'Failed to generate proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all border border-gray-100">
        {/* Header */}
        <div className="bg-orange-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaFileSignature className="text-2xl" />
            <h3 className="text-xl font-bold">Generate Proposal Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Section 1: Meta Proyek */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-4">
            <h4 className="font-bold text-orange-800 text-sm uppercase tracking-wider">File & Number Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Document Title (System) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Proposal Audit PT XYZ 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Letter Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="tanggalRaw"
                  value={formData.tanggalRaw}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Auto-constructed Letter Number Generator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reference Number <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="nomor_surat_seq"
                  value={formData.nomor_surat_seq}
                  onChange={handleInputChange}
                  placeholder="001"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Partner Signee <span className="text-red-500">*</span></label>
                <select
                  name="partner_code"
                  value={formData.partner_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  required
                  disabled={isSubmitting}
                >
                  {PARTNERS.map(p => (
                    <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Preview</label>
                <div className="px-4 py-2.5 bg-gray-200 border border-gray-300 rounded-lg text-gray-800 font-mono font-bold text-sm select-all flex items-center justify-between">
                  <span>{generatedData.nomorSurat}</span>
                  <FaCopy className="text-gray-400 cursor-pointer hover:text-gray-600" title="Klik untuk menyalin" onClick={() => {
                    navigator.clipboard.writeText(generatedData.nomorSurat)
                    toast.success('Nomor surat disalin!')
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Client Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b pb-1">Client & Company Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama_perusahaan"
                  value={formData.nama_perusahaan}
                  onChange={handleInputChange}
                  placeholder="Contoh: PT XYZ Indonesia"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
                <input
                  type="text"
                  name="perihal_proposal"
                  value={formData.perihal_proposal}
                  onChange={handleInputChange}
                  placeholder="Contoh: Penawaran Audit Laporan Keuangan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Address</label>
              <textarea
                name="alamat_perusahaan"
                value={formData.alamat_perusahaan}
                onChange={handleInputChange}
                rows="2"
                placeholder="Jl. Thamrin No. 10, Lantai 5, Jakarta Pusat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Salutation</label>
                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                >
                  <option value="Bapak">Bapak</option>
                  <option value="Ibu">Ibu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name (Attn.)</label>
                <input
                  type="text"
                  name="nama_client"
                  value={formData.nama_client}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Position</label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Direktur Utama"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Amount & Period */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b pb-1">Contract Value & Audit Period</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Financial Year Period</label>
                <input
                  type="text"
                  name="periode_tahun_buku"
                  value={formData.periode_tahun_buku}
                  onChange={handleInputChange}
                  placeholder="Contoh: 31 Desember 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Proposal (Number) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="nominal_uang_raw"
                  value={formData.nominal_uang_raw}
                  onChange={handleInputChange}
                  placeholder="50000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-bold"
                  required
                  disabled={isSubmitting}
                />
                <span className="text-xs text-orange-600 font-semibold mt-1 block">
                  Format Preview: {formData.nominal_uang_raw ? formatRupiah(formData.nominal_uang_raw) : 'Rp 0'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount In Words (Alphabet Rupiah) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nominal_dalam_alphabet"
                value={formData.nominal_dalam_alphabet}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-medium"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Proposal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default GenerateProposalModal
