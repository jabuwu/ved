import { parse } from 'https://deno.land/std@0.110.0/flags/mod.ts';
import { upgrade } from './upgrade.ts';
import { deno } from './util.ts';
import { getConfig, setConfig } from './config.ts';

const args = parse(Deno.args, { boolean: [ 'upgrade', 'init', 'local' ], string: [ 'host' ] });
if (args.init) {
  let response: string | null = null;
  const cliInput = args._.join(' ');
  if (cliInput) {
    response = cliInput;
  }
  if (!response) {
    response = prompt('Enter Repo (myname/ved-scripts:branch):');
  }
  if (response) {
    const repository = response.split(':')[0];
    const branch = response.split(':')[1] ?? 'main';
    await setConfig({ repository, branch });
  }
} else if (args.upgrade) {
  const host = args.host ?? 'https://ved.deno.dev';
  upgrade(host, args.local);
} else if (args._[0]) {
  const { repository, branch } = await getConfig();
  if (!repository || !branch) {
    console.log('ved is not configured, please run ved --init');
    Deno.exit(1);
  }
  await deno([ 'run', '--unstable', '-A', '-r', '-q', `https://raw.githubusercontent.com/${repository}/${branch}/${args._[0]}/index.ts` ]);
} else {
  const { repository, branch } = await getConfig();
  console.log('ved <command> <flags>');
  if (repository && branch) {
    console.log(`  ${repository}:${branch}`);
  }
  console.log('');
  console.log('flags:');
  console.log('  --init    - init with a repository');
  console.log('  --upgrade - upgrade ved to the latest version');
  console.log('');
  console.log('...there\'s not much here, yet');
}