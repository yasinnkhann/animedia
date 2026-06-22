import { recommendMediaStream } from '@/app/actions/ai';

export async function GET() {
  try {
    const stream = recommendMediaStream('a dark fantasy anime', 'MOVIE');
    const results = [];
    for await (const item of stream) {
      results.push(item);
    }
    return Response.json({ success: true, results });
  } catch (e: any) {
    return Response.json({ success: false, error: e.message, stack: e.stack });
  }
}
