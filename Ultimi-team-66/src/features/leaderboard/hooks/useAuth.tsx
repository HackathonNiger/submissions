'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAuth = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  return  currentUserId ;
};