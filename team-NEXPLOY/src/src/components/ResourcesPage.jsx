<<<<<<< HEAD
import React from 'react'

const ResourcesPage = () => {
  return (
    <div>ResourcesPage</div>
  )
}

export default ResourcesPage
=======
import { Book, AlertTriangle } from 'lucide-react';
import Navigation from './Navigation';
import logo from '../assets/VerifyMedsLogo.png'

const ResourcesPage = ({ currentPage, setCurrentPage, resetVerification }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
    <Navigation
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      resetVerification={resetVerification}
    />

    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        Resources
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-start space-x-4">
          <Book className="text-green-600 flex-shrink-0 mt-1" size={48} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              NAFDAC Greenbook
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The <strong>NAFDAC Greenbook</strong> is the official directory of registered pharmaceutical
              products in Nigeria. It provides comprehensive information about medicines that have been
              approved and registered by the National Agency for Food and Drug Administration and Control (NAFDAC).
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Use the Greenbook to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Verify registered pharmaceutical products</li>
              <li>Check manufacturer information</li>
              <li>Access detailed product specifications</li>
              <li>Confirm NAFDAC registration numbers</li>
            </ul>
            <a
              href="https://greenbook.nafdac.gov.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Visit NAFDAC Greenbook
            </a>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={48} />
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Report Counterfeit Drugs
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If you suspect you have encountered a counterfeit or substandard drug,
              it's crucial to report it immediately to help protect public health.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              NAFDAC investigates all reports and takes necessary enforcement actions
              to remove fake drugs from circulation.
            </p>
            <a
              href="https://greenbook.nafdac.gov.ng/report/sf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Report Suspicious Drug
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          About VerifyMeds
        </h2>
        <img src={logo} alt="VerifyMeds Logo" className='w-auto h-20 m-4' />
        <p className="text-gray-600 leading-relaxed mb-4">
          VerifyMeds is a user-friendly platform designed to empower Nigerians in the fight
          against counterfeit medicines. By providing easy-to-use verification tools, we aim
          to help protect your health and the health of your loved ones.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Always verify your medicines before use, and report any suspicious products to NAFDAC
          to help keep our communities safe.
        </p>
      </div>
    </div>
  </div>
);

export default ResourcesPage;
>>>>>>> ce4f729e2c400200517d21f26deadd9b0c510526
