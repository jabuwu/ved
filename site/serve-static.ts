import { staticDir, srcDir, sendFileResponse } from './util.ts';

export async function serveStatic(request: Request): Promise<Response | undefined> {
  const { origin, pathname } = new URL(request.url);
  if (pathname === '/install.sh') {
    return await sendFileResponse(`${staticDir}/install.sh`, { ORIGIN: origin });
  }
  if (pathname.split('/').includes('..')) {
    return undefined;
  }
  try {
    return await sendFileResponse(`${srcDir}/${pathname}`);
  } catch (_err) {
    return undefined;
  }
}