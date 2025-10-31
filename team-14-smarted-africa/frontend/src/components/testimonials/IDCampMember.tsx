import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IDCampMemberProps {
  name: string;
  role: string;
  achievement: string;
  icon: LucideIcon;
}

const IDCampMember: React.FC<IDCampMemberProps> = ({ name, role, achievement, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
    <p className="text-sm text-blue-600 mb-2">{role}</p>
    <p className="text-gray-600 text-sm">{achievement}</p>
  </div>
);

export default IDCampMember;