import { useState, useEffect, useRef } from 'react'
import {
  FaTimes, FaDownload, FaSearchPlus, FaSearchMinus,
  FaExpand, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaFileImage,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { documentService } from '../services'

const PREVIEWABLE = ['pdf', 'jpg', 'jpeg', 'png', 'txt']

const getFileIcon = (type) => {
  const t = type?.toLowerCase()
  if (t === 'pdf')              return <FaFilePdf   className="text-red-400   text-6xl" />
  if (t === 'doc' || t === 'docx') return <FaFileWord  className="text-blue-400  text-6xl" />
  if (t === 'xls' || t === 'xlsx') return <FaFileExcel className="text-green-400 text-6xl" />
  if (['jpg','jpeg','png'].includes(t)) return <FaFileImage className="text-purple-400 text-6xl" />
  return <FaFileAlt className="text-gray-400 text-6xl" />
}

const FilePreviewModal = ({ document, onClose, onDownload }) => {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const fileType = document?.file_type?.toLowerCase()
  const isImage  = ['jpg', 'jpeg', 'png'].includes(fileType)
  const isPdf    = fileType === 'pdf'
  const isTxt    = fileType === 'txt'
  const canPreview = PREVIEWABLE.includes(fileType)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!document || !canPreview) return

    let objectUrl = null
    setLoading(true)

    documentService.getPreview(document.id)
      .then(blob => {
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
      })
      .catch(() => {
        toast.error('Cannot load preview')
      })
      .finally(() => setLoading(false))

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [document?.id]) // eslint-disable-line

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!document) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex-shrink-0">{getFileIcon(document.file_type)}</div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 truncate">{document.title}</p>
              <p className="text-xs text-gray-500 truncate">{document.file_name} &bull; {document.file_type?.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            {/* Zoom controls (images only) */}
            {isImage && blobUrl && (
              <>
                <button
                  onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  title="Zoom out"
                >
                  <FaSearchMinus />
                </button>
                <span className="text-sm text-gray-600 w-14 text-center font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  title="Zoom in"
                >
                  <FaSearchPlus />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  title="Reset zoom"
                >
                  <FaExpand />
                </button>
              </>
            )}

            <button
              onClick={() => onDownload(document)}
              className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <FaDownload />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
              title="Close"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-3 py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
              <p className="text-gray-500 text-sm">Loading preview...</p>
            </div>

          ) : !canPreview ? (
            // No preview available
            <div className="flex flex-col items-center space-y-4 py-20 text-center px-8">
              {getFileIcon(document.file_type)}
              <p className="text-gray-600 font-semibold text-lg">Preview not available</p>
              <p className="text-gray-400 text-sm">
                {document.file_type?.toUpperCase()} files cannot be previewed in the browser.
              </p>
              <button
                onClick={() => onDownload(document)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
              >
                <FaDownload />
                <span>Download to View</span>
              </button>
            </div>

          ) : !blobUrl ? (
            <div className="py-20 text-gray-400 text-sm">Failed to load preview.</div>

          ) : isImage ? (
            // Image preview with zoom
            <div className="overflow-auto w-full h-full flex items-start justify-center p-4">
              <img
                src={blobUrl}
                alt={document.title}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
                className="max-w-full rounded shadow-md"
              />
            </div>

          ) : isPdf ? (
            // PDF preview via iframe
            <iframe
              src={blobUrl}
              title={document.title}
              className="w-full h-full border-0"
              style={{ minHeight: '70vh' }}
            />

          ) : isTxt ? (
            // Text file preview
            <TxtPreview blobUrl={blobUrl} />

          ) : null}
        </div>

      </div>
    </div>
  )
}

// Separate component to read text content
const TxtPreview = ({ blobUrl }) => {
  const [text, setText] = useState('')
  useEffect(() => {
    fetch(blobUrl)
      .then(r => r.text())
      .then(setText)
      .catch(() => setText('Unable to read file content.'))
  }, [blobUrl])

  return (
    <div className="w-full h-full overflow-auto p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        {text || 'Loading text...'}
      </pre>
    </div>
  )
}

export default FilePreviewModal
