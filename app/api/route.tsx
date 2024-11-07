import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  const baseMessage = 'Hello from Bangkok';
  
  // If code parameter exists, append it to the message
  const message = code ? `${baseMessage} (Code: ${code})` : baseMessage;
  
  return NextResponse.json({ message });
}