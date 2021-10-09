import { parse } from 'https://deno.land/std@0.110.0/flags/mod.ts';
import { upgrade } from './upgrade.ts';
import { deno } from './util.ts';
import { getConfig, setConfig } from './config.ts';

let operation = 'help';
if (Deno.args.length > 0) {
  if (Deno.args[0] === ':upgrade' || Deno.args[0] === '--upgrade') {
    operation = 'upgrade';
  } else if (Deno.args[0] === ':init') {
    operation = 'init';
  } else if (Deno.args[0] === ':reload') {
    operation = 'reload';
  } else {
    operation = 'command';
  }
}
if (operation === 'command') {
  const args = parse(Deno.args);
  let runLocal = false;
  try {
    const stat = await Deno.stat('.vedconfig.json');
    if (stat.isFile) {
      runLocal = true;
    }
  // deno-lint-ignore no-empty
  } catch {}
  if (runLocal) {
    await deno([ 'run', '--unstable', '-A', '-r', '-q', `./${args._[0]}/index.ts`, ...Deno.args.slice(1) ]);
  } else {
    const { repository, branch } = await getConfig();
    if (!repository || !branch) {
      console.log('ved is not configured, please run ved --init');
      Deno.exit(1);
    }
    await deno([ 'run', '--unstable', '-A', '-q', `https://raw.githubusercontent.com/${repository}/${branch}/${args._[0]}/index.ts` ]);
  }
} else if (operation === 'init') {
  const args = parse(Deno.args.slice(1));
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
} else if (operation === 'upgrade') {
  const args = parse(Deno.args.slice(1), { boolean: [ 'local' ], string: [ 'host' ] });
  const { vedHost } = await getConfig();
  const host = args.host ?? vedHost ?? 'https://ved.deno.dev';
  upgrade(host, args.local);
} else if (operation === 'reload') {
  const args = parse(Deno.args.slice(1));
  if (args._.length > 0) {
    const command = args._[0];
    const { repository, branch } = await getConfig();
    if (!repository || !branch) {
      console.log('ved is not configured, please run ved --init');
      Deno.exit(1);
    }
    await deno([ 'cache', '-r', '--unstable', `https://raw.githubusercontent.com/${repository}/${branch}/${command}/index.ts` ]);
  } else {
    console.log('command name required');
  }
} else {
  const { repository, branch } = await getConfig();
  console.log('ved <command> <flags>');
  if (repository && branch) {
    console.log(`  ${repository}:${branch}`);
  }
  console.log('');
  console.log('commands:');
  console.log('  :init         - init with a repository');
  console.log('  :upgrade      - upgrade ved to the latest version');
  console.log('  :reload       - reload cache for a command');
  console.log('  your commands - run any commands from your repository');
  console.log('');
  console.log('...there\'s not much here, yet');
}