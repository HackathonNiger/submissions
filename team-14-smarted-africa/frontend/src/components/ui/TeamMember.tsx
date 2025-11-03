import React from 'react';
import { Github, Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  github: string;
  linkedin: string;
  skills: string[];
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, github, linkedin, skills }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
      {name.split(' ').map(n => n[0]).join('')}
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
    <p className="text-sm text-green-600 mb-3">{role}</p>
    <div className="text-xs text-gray-600 mb-4 h-16 overflow-y-auto">
      {skills.map((skill, index) => (
        <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1">
          {skill}
        </span>
      ))}
    </div>
    <div className="flex justify-center space-x-3">
      <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
        <Github className="w-5 h-5" />
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
        <Linkedin className="w-5 h-5" />
      </a>
    </div>
  </div>
);

export default TeamMember;