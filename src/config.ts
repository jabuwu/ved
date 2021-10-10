import { ensureDir } from 'https://deno.land/std@0.110.0/fs/mod.ts';
import { getAppConfigDir } from './util.ts';

export interface VedConfig {
  vedHost?: string;
  repository?: string;
  branch?: string;
}

export async function getVedConfigDir() {
  return await getAppConfigDir('ved');
}

export async function getConfig(): Promise<VedConfig> {
  try {
    return JSON.parse(await Deno.readTextFile(`${await getVedConfigDir()}/config.json`));
  } catch (_err) {
    return {};
  }
}

export async function setConfig(obj: Partial<VedConfig>) {
  const configDir = await getVedConfigDir();
  await ensureDir(configDir);
  await Deno.writeTextFile(`${configDir}/config.json`, JSON.stringify(Object.assign(await getConfig(), obj), null, 2));
}