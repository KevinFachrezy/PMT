import { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { templateService } from '../services'

const TemplateFormModal = ({ isOpen, onClose, template, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({})
  const [documentTitle, setDocumentTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!documentTitle.trim()) {
      toast.error('Document title is required')
      return
    }

    try {
      setLoading(true)

      const payload = {
        data: formData,
        project_id: projectId,
        title: documentTitle,
      }

      const response = await templateService.generate(template.id, payload)
      const data = response.data || response

      toast.success('Document generated successfully!')
      onSuccess(data)
      onClose()
    } catch (error) {
      console.error('Failed to generate document:', error)
      toast.error(error.response?.data?.message || 'Failed to generate document')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !template) return null

  const variables = template.variables || {}
  const variableKeys = Object.keys(variables)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Fill Template: {template.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the required information to generate document
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Document Title */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Template Variables */}
          {variableKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No variables to fill for this template
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Template Variables
              </h3>
              {variableKeys.map((key) => {
                const label = variables[key]
                const isTextarea = key.includes('description') || 
                                  key.includes('notes') || 
                                  key.includes('agenda') ||
                                  key.includes('discussion') ||
                                  key.includes('objectives') ||
                                  key.includes('scope') ||
                                  key.includes('deliverables')

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                      <span className="text-gray-400 ml-2 text-xs">
                        {`{{${key.toUpperCase()}}}`}
                      </span>
                    </label>
                    {isTextarea ? (
                      <textarea
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Leave fields empty if you want to fill them manually later. 
              The document will be generated with placeholder text.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !documentTitle.trim()}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Generate Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateFormModal
