import React from 'react';

interface PartnerLogoProps {
  name: string;
  logo: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ name, logo }) => (
  <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="text-2xl font-bold text-gray-800">{logo}</div>
  </div>
);

export default PartnerLogo;