export class argv {
  constructor(public file: string) {}
}

export const handler = (args: argv): void => {
  console.log(`file is ${args.file}`);
};
