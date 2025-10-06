
const roleProjectSets = {
  'frontend-developer': {
    roleName: 'Frontend Developer',
    roleDescription: 'Create engaging user experiences for websites and web apps',
    beginner: {
      title: 'Foundation Projects',
      description: 'Build core frontend skills with essential projects.',
      projects: [
        { 
          id: 1, 
          title: 'Personal Portfolio Website', 
          description: 'Create a responsive portfolio showcasing your work and skills', 
          duration: '8-10 hours', 
          completed: false, 
          technologies: ['HTML', 'CSS', 'JavaScript'],
          hasVisual: true,
          difficulty: 'Beginner',
          objectives: ['Responsive Design', 'CSS Flexbox/Grid', 'Interactive Elements', 'Cross-browser Compatibility']
        },
        { 
          id: 2, 
          title: 'Interactive Todo Application', 
          description: 'Build a task management app with local storage persistence', 
          duration: '6-8 hours', 
          completed: false, 
          technologies: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
          hasVisual: true,
          difficulty: 'Beginner',
          objectives: ['DOM Manipulation', 'Event Handling', 'Local Storage', 'Form Validation']
        },
        { 
          id: 3, 
          title: 'Weather Dashboard', 
          description: 'Fetch and display weather data with location search', 
          duration: '5-7 hours', 
          completed: false, 
          technologies: ['JavaScript', 'API Integration', 'CSS'],
          hasVisual: true,
          difficulty: 'Beginner',
          objectives: ['API Integration', 'Async/Await', 'Error Handling', 'Dynamic Content']
        },
        { 
          id: 4, 
          title: 'Landing Page Clone', 
          description: 'Recreate a modern landing page design pixel-perfectly', 
          duration: '4-6 hours', 
          completed: false, 
          technologies: ['HTML', 'CSS', 'Responsive Design'],
          hasVisual: true,
          difficulty: 'Beginner',
          objectives: ['CSS Layouts', 'Typography', 'Color Theory', 'Mobile-First Design']
        }
      ],
    },
    intermediate: {
      title: 'Advanced Frontend',
      description: 'Master complex interactions and modern frameworks.',
      projects: [
        { 
          id: 5, 
          title: 'E-commerce Product Catalog', 
          description: 'Build a filterable product catalog with cart functionality', 
          duration: '12-15 hours', 
          completed: false, 
          technologies: ['React', 'Context API', 'CSS Modules'],
          hasVisual: true,
          difficulty: 'Intermediate',
          objectives: ['React Components', 'State Management', 'Filtering/Search', 'Shopping Cart Logic']
        },
        { 
          id: 6, 
          title: 'Real-time Chat Interface', 
          description: 'Create a modern chat application with live messaging', 
          duration: '10-12 hours', 
          completed: false, 
          technologies: ['React', 'WebSockets', 'CSS Animations'],
          hasVisual: true,
          difficulty: 'Intermediate',
          objectives: ['WebSocket Integration', 'Real-time Updates', 'Message Threading', 'Emoji Support']
        },
        { 
          id: 7, 
          title: 'Data Visualization Dashboard', 
          description: 'Build interactive charts and graphs for business data', 
          duration: '8-10 hours', 
          completed: false, 
          technologies: ['React', 'Chart.js', 'API Integration'],
          hasVisual: true,
          difficulty: 'Intermediate',
          objectives: ['Chart Libraries', 'Data Processing', 'Interactive Filters', 'Export Features']
        }
      ],
    },
    advanced: {
      title: 'Professional Projects',
      description: 'Build production-ready applications with best practices.',
      projects: [
        { 
          id: 8, 
          title: 'Multi-tenant SaaS Frontend', 
          description: 'Create a scalable SaaS application with role-based access', 
          duration: '25-30 hours', 
          completed: false, 
          technologies: ['React', 'Redux', 'TypeScript', 'Testing'],
          hasVisual: true,
          difficulty: 'Advanced',
          objectives: ['Architecture Design', 'State Management', 'User Authentication', 'Testing Strategy']
        },
        { 
          id: 9, 
          title: 'Progressive Web App', 
          description: 'Build a PWA with offline capabilities and push notifications', 
          duration: '20-25 hours', 
          completed: false, 
          technologies: ['React', 'Service Workers', 'IndexedDB', 'Web APIs'],
          hasVisual: true,
          difficulty: 'Advanced',
          objectives: ['PWA Features', 'Offline Storage', 'Performance Optimization', 'Web APIs']
        }
      ],
    }
  },
  'backend-developer': {
    roleName: 'Backend Developer',
    roleDescription: 'Develop robust server-side applications and APIs',
    beginner: {
      title: 'API Fundamentals',
      description: 'Learn to build and manage server-side applications.',
      projects: [
        { 
          id: 1, 
          title: 'REST API for Todo App', 
          description: 'Create a complete CRUD API with user authentication', 
          duration: '10-12 hours', 
          completed: false, 
          technologies: ['Node.js', 'Express', 'MongoDB'],
          hasVisual: false,
          difficulty: 'Beginner',
          objectives: ['REST Principles', 'Database Design', 'Authentication', 'Error Handling']
        }
      ],
    },
    intermediate: {
      title: 'Advanced Backend',
      description: 'Build scalable and secure backend systems.',
      projects: [
        { 
          id: 2, 
          title: 'Microservices Architecture', 
          description: 'Design and implement a microservices-based system', 
          duration: '15-20 hours', 
          completed: false, 
          technologies: ['Node.js', 'Docker', 'Redis', 'PostgreSQL'],
          hasVisual: false,
          difficulty: 'Intermediate',
          objectives: ['Service Communication', 'Load Balancing', 'Caching', 'Database Optimization']
        }
      ],
    },
    advanced: {
      title: 'Enterprise Solutions',
      description: 'Build enterprise-grade backend systems.',
      projects: [
        { 
          id: 3, 
          title: 'Distributed System with Message Queue', 
          description: 'Create a fault-tolerant distributed system', 
          duration: '30-40 hours', 
          completed: false, 
          technologies: ['Node.js', 'RabbitMQ', 'Kubernetes', 'Monitoring'],
          hasVisual: false,
          difficulty: 'Advanced',
          objectives: ['System Design', 'Message Queues', 'Fault Tolerance', 'Monitoring']
        }
      ],
    }
  }
};
export default roleProjectSets