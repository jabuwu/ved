import { staticDir, getUserAgentType, sendFileResponse } from './util.ts';

export async function serveIndex(request: Request): Promise<Response | undefined> {
  const { origin, pathname } = new URL(request.url);
  if (pathname === '/') {
    const userAgentType = getUserAgentType(request.headers.get('user-agent'));
    if (userAgentType === 'curl') {
      return await sendFileResponse(`${staticDir}/index.sh`, { ORIGIN: origin });
    } else {
      return await sendFileResponse(`${staticDir}/index.html`, { ORIGIN: origin });
    }
  }
}