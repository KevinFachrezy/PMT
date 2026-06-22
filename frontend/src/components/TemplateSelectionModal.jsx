import { useState, useEffect } from 'react'
import { FaTimes, FaFileAlt, FaChevronRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { templateService } from '../services'

const TemplateSelectionModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      fetchTemplates()
    }
  }, [isOpen, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await templateService.getCategories()
      const data = response.data || response
      setCategories([{ value: '', label: 'All Categories' }, ...(data || [])])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await templateService.getAll(selectedCategory || null)
      const data = response.data || response
      setTemplates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
  }

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'financial':
        return '💰'
      case 'legal':
        return '⚖️'
      case 'project':
        return '📊'
      case 'general':
        return '📄'
      default:
        return '📁'
    }
  }

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'financial':
        return 'bg-green-100 text-green-700'
      case 'legal':
        return 'bg-blue-100 text-blue-700'
      case 'project':
        return 'bg-purple-100 text-purple-700'
      case 'general':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Select Document Template</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a template to generate document from
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No templates available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getCategoryIcon(template.category)}
                      </span>
                      <h3 className="font-semibold text-gray-800">
                        {template.name}
                      </h3>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getCategoryBadgeColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.file_extension.toUpperCase()}
                    </span>
                  </div>

                  {/* Variables Count */}
                  {template.variables && Object.keys(template.variables).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {Object.keys(template.variables).length} variables to fill
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedTemplate ? (
              <span className="flex items-center space-x-2">
                <FaFileAlt className="text-orange-600" />
                <span>Selected: <strong>{selectedTemplate.name}</strong></span>
              </span>
            ) : (
              <span>Select a template to continue</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTemplate}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedTemplate
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelectionModal
