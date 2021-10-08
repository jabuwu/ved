import os from 'https://deno.land/x/dos@v0.11.0/mod.ts';

export async function deno(denoCmd: string[]) {
  const process = Deno.run({
    cmd: [ Deno.execPath(), ...denoCmd ],
    stderr: 'inherit',
    stdout: 'inherit',
    stdin: 'inherit',
  });
  await process.status();
}

export async function where(program: string): Promise<string | undefined> {
  const process = Deno.run({
    cmd: [ os.platform() === 'windows' ? 'where' : 'which', program ],
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