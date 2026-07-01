import { useState, useEffect, useMemo } from 'react'
import {
  FaFile, FaDownload, FaTrash, FaUpload,
  FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage,
  FaMagic, FaEye, FaCalendarAlt, FaFolder, FaFolderOpen, FaFileSignature
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TemplateSelectionModal from '../components/TemplateSelectionModal'
import TemplateFormModal from '../components/TemplateFormModal'
import FilePreviewModal from '../components/FilePreviewModal'
import CalendarView from '../components/CalendarView'
import GenerateProposalModal from '../components/GenerateProposalModal'
import { documentService, projectService } from '../services'
import { useAuthStore } from '../stores/authStore'

const FOLDERS = [
  { name: 'Admin', roles: ['manager'], desc: 'Collection of internal administration documents (Manager Only)' },
  { name: 'Client Data', roles: ['manager', 'project_handler'], desc: 'Documents and data files from clients' },
  { name: 'KKP', roles: ['manager', 'project_handler'], desc: 'Audit Working Papers (KKP)' },
  { name: 'REPORT', roles: ['manager', 'project_handler'], desc: 'Final reports, proposals, and audit reports' },
  { name: 'Last Year', roles: ['manager', 'project_handler'], desc: 'Archive of last year files and supporting documents' }
]

const DocumentCenter = () => {
  const { user } = useAuthStore()
  const [documents, setDocuments] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState('')
  const [activeFolder, setActiveFolder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadData, setUploadData] = useState({ project_id: '', title: '', file: null })
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateProjectId, setTemplateProjectId] = useState('')
  const [previewDoc, setPreviewDoc] = useState(null)
  const [downloadTarget, setDownloadTarget] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGenerateProposal, setShowGenerateProposal] = useState(false)

  useEffect(() => {
    fetchProjects()
    fetchDocuments()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchDocuments()
    }
  }, [selectedProject, activeFolder])

  const activeProject = useMemo(() => {
    if (!selectedProject) return null
    return projects.find((p) => String(p.id) === String(selectedProject)) || null
  }, [selectedProject, projects])

  const visibleFolders = useMemo(() => {
    return FOLDERS.filter(f => f.roles.includes(user?.role))
  }, [user])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectService.getAll()
      const data = response.data?.success ? response.data.data : response.data
      setProjects(Array.isArray(data) ? data : data?.data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedProject) params.project_id = selectedProject
      if (searchTerm) params.search = searchTerm
      if (activeFolder) params.folder_name = activeFolder

      const response = await documentService.getAll(params)
      const data = response.data?.success ? response.data.data : response.data
      setDocuments(Array.isArray(data) ? data : data?.data || [])
    } catch (err) {
      console.error('Error fetching documents:', err)
      toast.error('Failed to load documents')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }
    setUploadData(prev => ({ ...prev, file }))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadData.project_id) {
      toast.error('Please select a project')
      return
    }
    if (!uploadData.title.trim()) {
      toast.error('Please enter document title')
      return
    }
    if (!uploadData.file) {
      toast.error('Please select a file')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('project_id', uploadData.project_id)
      if (activeFolder) {
        formData.append('folder_name', activeFolder)
      }
      formData.append('title', uploadData.title)
      formData.append('file', uploadData.file)

      await documentService.upload(formData)
      toast.success('Document uploaded successfully')
      setUploadData(prev => ({ ...prev, title: '', file: null }))
      const el = window.document.getElementById('file-upload')
      if (el) el.value = ''
      fetchDocuments()
    } catch (err) {
      console.error('Error uploading document:', err)
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (doc) => {
    try {
      const blob = await documentService.download(doc.id)
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = doc.file_name
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      window.document.body.removeChild(a)
      toast.success('Download started')
    } catch (err) {
      console.error('Error downloading document:', err)
      toast.error('Failed to download document')
    }
  }

  const requestDownload = (doc) => setDownloadTarget(doc)

  const confirmDownload = async () => {
    if (!downloadTarget) return
    await handleDownload(downloadTarget)
    setDownloadTarget(null)
  }

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await documentService.delete(documentId)
      toast.success('Document deleted successfully')
      setDocuments(prev => prev.filter(d => d.id !== documentId))
    } catch (err) {
      console.error('Error deleting document:', err)
      toast.error(err.response?.data?.message || 'Failed to delete document')
    }
  }

  const getFileIcon = (fileType) => {
    const t = fileType?.toLowerCase()
    if (t === 'pdf') return <FaFilePdf className="text-red-500 text-4xl" />
    if (t === 'doc' || t === 'docx') return <FaFileWord className="text-blue-500 text-4xl" />
    if (t === 'xls' || t === 'xlsx') return <FaFileExcel className="text-green-500 text-4xl" />
    if (['jpg', 'jpeg', 'png'].includes(t)) return <FaFileImage className="text-purple-500 text-4xl" />
    return <FaFileAlt className="text-gray-500 text-4xl" />
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleOpenTemplateSelection = () => {
    if (!templateProjectId) {
      toast.error('Please select a project first')
      return
    }
    setShowTemplateSelection(true)
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setShowTemplateSelection(false)
    setShowTemplateForm(true)
  }

  const handleTemplateSuccess = () => {
    setShowTemplateForm(false)
    setSelectedTemplate(null)
    fetchDocuments()
  }

  const projectCards = useMemo(() => {
    return projects.map((project) => {
      // In folder list view, we don't have folder_name filtered yet so we count all files of this project
      const docs = documents.filter((d) => String(d.project_id) === String(project.id))
      return {
        project,
        count: docs.length,
        latest: docs[0] || null,
      }
    })
  }, [projects, documents])

  const visibleDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const hay = `${doc.title || ''} ${doc.file_name || ''}`.toLowerCase()
        return hay.includes(q)
      }
      return true
    })
  }, [documents, searchTerm])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-orange-600">Document Center</h1>
          </div>

          {!activeProject ? (
            <>
              {/* Project Folders Overview */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Folders</h2>
                <p className="text-base text-gray-600">Select a project to open the Document Center and manage all your project documents.</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600" />
                </div>
              ) : projectCards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <FaFile className="mx-auto text-gray-300 text-6xl mb-4" />
                  <p className="text-gray-500 text-lg">No projects found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {projectCards.map(({ project, count, latest }) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        const id = String(project.id)
                        setSelectedProject(id)
                        setUploadData({ project_id: id, title: '', file: null })
                        setTemplateProjectId(id)
                        setSearchTerm('')
                        setActiveFolder(null) // reset to folders view
                      }}
                      className="text-left bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-orange-300 transition-all duration-300 p-7 hover:scale-105 hover:translate-y-[-4px]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200">
                          {count} file{count !== 1 ? 's' : ''}
                        </span>
                        <FaFileAlt className="text-orange-500 text-2xl" />
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">Client: <span className="font-semibold text-gray-800">{project.client_name || project.client?.name || 'Tidak ada'}</span></p>

                      <div className="border-t border-gray-200 pt-4 text-sm text-gray-600">
                        {latest ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">Latest</span>
                            <span className="truncate font-medium text-gray-800" title={latest.title}>{latest.title}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">No documents found</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : !activeFolder ? (
            <>
              {/* Folder Grid View */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
                <div>
                  <button
                    onClick={() => {
                      setSelectedProject('')
                      setSearchTerm('')
                    }}
                    className="text-sm text-orange-600 hover:text-orange-800 font-bold mb-3 inline-flex items-center transition-colors"
                  >
                    ← Back to Project List
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{activeProject.title}</h2>
                  <p className="text-base text-gray-600">Select a folder below to access or upload files.</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visibleFolders.map((folder) => {
                    const count = documents.filter(d => d.folder_name === folder.name).length
                    return (
                      <button
                        key={folder.name}
                        onClick={() => {
                          setActiveFolder(folder.name)
                        }}
                        className="text-left bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-orange-300 transition-all p-6 hover:scale-105 flex items-start space-x-4"
                      >
                        <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                          <FaFolderOpen className="text-4xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg text-gray-900 truncate">{folder.name}</h3>
                            <span className="text-xs font-bold px-2.5 py-1 rounded bg-orange-100 text-orange-700">
                              {count} file{count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2 leading-relaxed">{folder.desc}</p>
                          <span className="text-xs font-semibold text-orange-600 hover:underline">Open Folder →</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Files Inside Active Folder View */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <button
                      onClick={() => {
                        setActiveFolder(null)
                        setSearchTerm('')
                      }}
                      className="text-sm text-orange-600 hover:text-orange-800 font-bold mb-3 inline-flex items-center transition-colors"
                    >
                      ← Back to Folder List
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      {activeProject.title} / <span className="text-orange-600">{activeFolder}</span>
                    </h2>
                    <p className="text-base text-gray-600">
                      {FOLDERS.find(f => f.name === activeFolder)?.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Proposal generator button — only in REPORT or Admin */}
                    {(activeFolder === 'REPORT') && (
                      <button
                        onClick={() => setShowGenerateProposal(true)}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        <FaFileSignature className="text-lg" />
                        <span>Generate Proposal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Document Section */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaUpload className="mr-3 text-orange-600 text-xl" />
                  Upload to Folder: {activeFolder}
                </h2>
                <form onSubmit={handleUpload} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Document Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={uploadData.title}
                        onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter document title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">File <span className="text-red-500">*</span></label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">Maksimal ukuran file: 10MB</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                  >
                    <FaUpload />
                    <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
                  </button>
                </form>
              </div>

              {/* Search & Refresh */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documents by title or file name..."
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                  />
                </div>
                <button
                  onClick={fetchDocuments}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Refresh
                </button>
              </div>

              {/* Documents List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600" />
                </div>
              ) : visibleDocuments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <FaFile className="mx-auto text-gray-300 text-6xl mb-4" />
                  <p className="text-gray-500 text-lg">No documents found in folder: {activeFolder}</p>
                  <p className="text-gray-400 text-sm mt-2">Upload your first document above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleDocuments.map(doc => (
                    <div key={doc.id} className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden hover:scale-105 hover:translate-y-[-4px]">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center py-8 border-b border-gray-200">{getFileIcon(doc.file_type)}</div>

                      <div className="p-7">
                        <div className="text-center mb-6">
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-snug" title={doc.title}>{doc.title}</h3>
                          <p className="text-sm text-gray-600 truncate font-medium" title={doc.file_name}>{doc.file_name}</p>
                          <p className="text-xs text-gray-500 mt-3 font-semibold">{formatFileSize(doc.file_size)} &bull; {doc.file_type?.toUpperCase()}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-5 mb-6 text-xs text-gray-600 space-y-2">
                          <p className="truncate"><span className="font-bold text-gray-800">Uploaded by:</span> {doc.uploader?.name || 'N/A'}</p>
                          <p><span className="font-bold text-gray-800">Date:</span> {new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                          >
                            <FaEye className="text-lg" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => requestDownload(doc)}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <FaDownload className="text-lg" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                            title="Delete document"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <TemplateSelectionModal
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <TemplateFormModal
        isOpen={showTemplateForm}
        onClose={() => {
          setShowTemplateForm(false)
          setSelectedTemplate(null)
        }}
        template={selectedTemplate}
        projectId={templateProjectId}
        onSuccess={handleTemplateSuccess}
      />

      {previewDoc && (
        <FilePreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownload}
        />
      )}

      {downloadTarget && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Konfirmasi Download</h3>
            <p className="text-gray-700 mb-8 text-base leading-relaxed">
              Apakah Anda yakin ingin mendownload file berikut?
              <br />
              <span className="font-bold text-orange-600 block mt-2">{downloadTarget.file_name}</span>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDownloadTarget(null)}
                className="px-7 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="px-7 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Lanjutkan Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Proposal Modal */}
      <GenerateProposalModal
        isOpen={showGenerateProposal}
        onClose={() => setShowGenerateProposal(false)}
        projectId={selectedProject}
        onSuccess={() => {
          setShowGenerateProposal(false)
          fetchDocuments() // reload documents list
        }}
      />
    </div>
  )
}

export default DocumentCenter
