  export const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-[#DAA425] text-white';
    if (rank === 2) return 'bg-[#C0C0C0] text-white';
    if (rank === 3) return 'bg-amber-700 text-white';
    return 'bg-gray-100 text-gray-800';
  };

  export const getLeagueBadgeColor = (league: string): string => {
    switch (league) {
      case 'Diamond':
        return 'bg-[#B9F2FF] text-[#1a3c34]';
      case 'Platinum':
        return 'bg-[#E5E4E2] text-[#1a1a1a]';
      case 'Gold':
        return 'bg-[#FFD700] text-[#1a1a1a]';
      case 'Silver':
        return 'bg-[#C0C0C0] text-[#1a1a1a]';
      case 'Bronze':
        return 'bg-[#CD7F32] text-[#1a1a1a]';
      default:
        return 'bg-[#CED0DD] text-[#1a1a1a]';
    }
  };