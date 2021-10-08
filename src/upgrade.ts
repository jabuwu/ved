import { deno } from './util.ts';
import os from 'https://deno.land/x/dos@v0.11.0/mod.ts';
import { setConfig } from './config.ts';

export async function upgrade(host: string, local: boolean) {
  while (host.endsWith('/')) {
    host = host.substr(0, host.length - 1);
  }
  await setConfig({ vedHost: host });
  if (local) {
    if (os.platform() === 'windows') {
      console.log('Sorry but ved does not support Windows.');
      Deno.exit(1);
    }
    await deno([ 'install', '-f', '-r', '-A', '-n', 'ved', '--unstable', `${host}/cli.ts` ]);
  } else {
    await deno([ 'run', '-q', '-r', '-A', '--unstable', `${host}/cli.ts`, ':upgrade', '--local', '--host', host ]);
  }
}