import chalk from "chalk";

export default {
  info: (message: string) => chalk.bold(message),
  success: (message: string) => chalk.bold.hex("#3eaf7c")(message),
  error: (message: string) => chalk.bold.red(message),
};