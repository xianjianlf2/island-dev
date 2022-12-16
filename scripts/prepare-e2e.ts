import path from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

const ROOT = path.resolve(__dirname, '..');

const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2e() {
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    // 执行 pnpm build
    execa.commandSync('pnpm build', {
      cwd: ROOT
    });
  }

  execa.commandSync('npx playwright install', {
    cwd: ROOT
  });

  execa.commandSync('pnpm dev', {
    cwd: exampleDir,
    ...defaultExecaOpts
  });
}

prepareE2e();
