import { fetchSubjects } from '@/lib/api/subject.api';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page');
  const limit = url.searchParams.get('limit');

  const pageNum = parseInt(page || '1', 10); 
  const limitNum = parseInt(limit || '3', 10); 

  if (isNaN(pageNum) || isNaN(limitNum)) {
    return new Response(
      JSON.stringify({ error: 'Invalid page or limit parameter' }),
      { status: 400 }
    );
  }

  try {
    const subjects = await fetchSubjects(pageNum, limitNum);
    return new Response(JSON.stringify({ subjects }), { status: 200 });
  } catch (error ) {
    console.error('Error fetching subjects:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch subjects' }),
      { status: 500 }
    );
  }
}
