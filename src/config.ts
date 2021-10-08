import { ensureDir } from 'https://deno.land/std@0.110.0/fs/mod.ts';

export interface VedConfig {
  repository?: string;
  branch?: string;
}

export function getConfigDir() {
  const home = Deno.env.get('HOME');
  if (!home) {
    console.log('The HOME environment variable must be set.');
    Deno.exit(1);
  }
  return `${home}/.config/ved`;
}

export async function getConfig(): Promise<VedConfig> {
  try {
    return JSON.parse(await Deno.readTextFile(`${getConfigDir()}/config.json`));
  } catch (_err) {
    return {};
  }
}

export async function setConfig(obj: Partial<VedConfig>) {
  await ensureDir(getConfigDir());
  await Deno.writeTextFile(`${getConfigDir()}/config.json`, JSON.stringify(Object.assign(await getConfig(), obj), null, 2));
}