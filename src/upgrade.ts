import { deno, detachedEval } from './util.ts';
import { setConfig } from './config.ts';

export async function upgrade(host: string, local: boolean) {
  while (host.endsWith('/')) {
    host = host.substr(0, host.length - 1);
  }
  await setConfig({ vedHost: host });
  if (local) {
    if (Deno.build.os === 'windows') {
      await detachedEval(`
        await new Promise(resolve => setTimeout(resolve, 1000));
        const process = Deno.run({
          cmd: [ Deno.execPath(), 'install', '-f', '-r', '-A', '-n', 'ved', '--unstable', '--no-check', '${host}/cli.ts' ],
          stderr: 'inherit',
          stdout: 'inherit',
          stdin: 'inherit'
        });
        await process.status();
      `.replace(/\n/g, ''));
    } else {
      await deno([ 'install', '-f', '-r', '-A', '-n', 'ved', '--unstable', '--no-check', `${host}/cli.ts` ]);
    }
  } else {
    await deno([ 'run', '-q', '-r', '-A', '--unstable', `${host}/cli.ts`, ':upgrade', '--local', '--host', host ]);
  }
}