import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const stateName = searchParams.get('stateName');

        if (!stateName) {
            return NextResponse.json(
                { error: 'State name is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: cities, error } =  await supabase
            .from('cities')
            .select('name')
            .eq('state_name', stateName)
            .order('name');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(cities.map(city => city.name));
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 