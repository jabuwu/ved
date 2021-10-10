import { join } from 'https://deno.land/std@0.110.0/path/mod.ts';

export async function deno(denoCmd: string[]) {
  const process = Deno.run({
    cmd: [ Deno.execPath(), ...denoCmd ],
    stderr: 'inherit',
    stdout: 'inherit',
    stdin: 'inherit',
  });
  await process.status();
}

export async function detachedEval(code: string) {
  if (Deno.build.os === 'windows') {
    const process = Deno.run({
      cmd: [ 'cmd', '/c', 'start', '/min', 'deno', 'eval', code ],
      stdin: 'null',
      stderr: 'null',
      stdout: 'null',
    });
    await process.status();
  } else {
    const process = Deno.run({
      cmd: [ Deno.execPath(), 'eval', code ],
      stdin: 'null',
      stderr: 'null',
      stdout: 'null',
    });
    await process.status();
  }
}

export async function where(program: string): Promise<string | undefined> {
  const process = Deno.run({
    cmd: [ Deno.build.os === 'windows' ? 'where' : 'which', program ],
    stdin: 'null',
    stderr: 'null',
    stdout: 'piped',
  });
  if ((await process.status()).success) {
    const decoder = new TextDecoder();
    return decoder.decode(await process.output()).trim();
  }
  return undefined;
}

export async function whoami(): Promise<string | undefined> {
  const process = Deno.run({
    cmd: [ 'whoami' ],
    stdin: 'null',
    stderr: 'null',
    stdout: 'piped',
  });
  if ((await process.status()).success) {
    const decoder = new TextDecoder();
    const name = decoder.decode(await process.output()).trim();
    if (Deno.build.os === 'windows') {
      return name.replace(/^.*\\/, '');
    }
    return name;
  }
  return undefined;
}

export async function getHomeDir(path?: string) {
  let home: string;
  if (Deno.build.os === 'windows') {
    home = `C:\\Users\\${await whoami()}`;
  } else {
    home = Deno.env.get('HOME')!;
    if (!home) {
      console.log('The HOME environment variable must be set.');
      Deno.exit(1);
    }
  }
  if (path) {
    return join(home, path);
  }
  return home;
}

export async function getAppConfigDir(path?: string) {
  let appConfigDir: string;
  if (Deno.build.os === 'windows') {
    appConfigDir = await getHomeDir('\\AppData\\Local');
  } else {
    appConfigDir = `${await getHomeDir()}/.config`;
  }
  if (path) {
    return join(appConfigDir, path);
  }
  return appConfigDir;
}

export async function getAppTempDir(path?: string) {
  let tempDir: string;
  if (Deno.build.os === 'windows') {
    tempDir = await getAppConfigDir('Temp');
  } else {
    tempDir = `/tmp`;
  }
  if (path) {
    return join(tempDir, path);
  }
  return tempDir;
}