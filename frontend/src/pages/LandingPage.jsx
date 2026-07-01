import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-600">WS PMT</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Widianto & Sumbogo
            <br />
            <span className="text-orange-600">Project Management Tool</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A web-based project management system designed specifically for accounting firms
            to work more efficiently in handling clients, managing documents, and tracking deadlines.
          </p>
          <div className="space-x-4">

            <Link
              to="/login"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
            <p className="text-gray-600">
              Monitor project progress in real time with an intuitive dashboard
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">Document Hub</h3>
            <p className="text-gray-600">
              Manage all documents in one place with a centralized storage system
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Notifications</h3>
            <p className="text-gray-600">
              Get instant updates for every change in your project
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
