module.exports = {
  '**/*.(ts|tsx|js)': (filenames) => [
    `yarn eslint --fix ${filenames.join(' ')}`,
    `yarn prettier --write  ${filenames.join(' ')}`,
    'yarn tsc --noEmit',
    'yarn test',
  ],
};
