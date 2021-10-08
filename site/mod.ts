import { serveIndex } from './serve-index.ts';
import { serveStatic } from './serve-static.ts';

async function handleRequest(request: Request) {
  try {
    let response: Response | undefined;
    response ??= await serveIndex(request);
    response ??= await serveStatic(request);
    if (!response) {
      response = new Response('404', {
        status: 404,
      });
    }
    return response;
  } catch (err: unknown) {
    console.error(err);
    return new Response('internal error', {
      status: 500,
      headers: {
        'content-type': 'text/css',
      },
    });
  }
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});