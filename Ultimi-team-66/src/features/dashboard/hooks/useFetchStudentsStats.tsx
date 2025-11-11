'use client'
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query"; 
import { toast } from "sonner";
 


const fetchCounts = async () => {
    try {
      const { count: studentCount, error: studentError } = await supabase
        .from('students')
        .select('id', { count: 'exact' });

      const { count: sponsorCount, error: sponsorError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('user_type', 'sponsor');

      if (studentError || sponsorError) {
        toast.error('Failed to load counts');
        return;
      }

    //   setTotalStudents(studentCount ?? 0);
    //   setTotalSponsors(sponsorCount ?? 0);
      

    return {studentCount, sponsorCount }

    }catch (err: unknown) {
      const msg =
        (err as { response: { message: string } })?.response?.message ||
        (err as { messgae: string }).messgae ||
        'An unexpected error occurred';
      toast.error(msg);
    }
  };

 

export const useFetchStudentsStats = () => {

const {data: studentStats, isLoading: studentStatsLoading} = useQuery({queryKey: ["fetch-students-counts"], queryFn: fetchCounts })


return {studentStats, studentStatsLoading}
}