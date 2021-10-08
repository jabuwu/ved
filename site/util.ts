export const rootDir = (() => {
  const dir = import.meta.url.substr(0, import.meta.url.length - '/site/util.ts'.length);
  if (dir.startsWith('file:///')) {
    return dir.substr(7);
  }
  return dir;
})();
export const staticDir = `${rootDir}/site/static`;
export const srcDir = `${rootDir}/src`;

export function mime(fn: string) {
  if (fn.endsWith('.html')) {
    return 'text/html';
  }
  return 'text/plain';
}

export async function sendFileResponse(filename: string, vars?: { [ key: string ]: string }) {
  let file = await Deno.readFile(filename);
  if (vars) {
    let fileStr = new TextDecoder().decode(file);
    for (const key in vars) {
      fileStr = fileStr.split(`@${key}@`).join(vars[key]);
    }
    file = new TextEncoder().encode(fileStr);
  }
  return new Response(file, {
    headers: {
      'content-type': mime(filename),
    },
  });
}

export function getUserAgentType(userAgent: string | null): 'browser' | 'curl' | 'deno' {
  userAgent ||= '';
  userAgent = userAgent.toLowerCase();
  if (userAgent.startsWith('curl') || userAgent.startsWith('wget')) {
    return 'curl';
  }
  if (userAgent.startsWith('deno')) {
    return 'deno';
  }
  return 'browser';
}