#!/usr/bin/env node
import { setupTreeCommand } from './@commands/cli';

const program = setupTreeCommand();
program.parse(process.argv); 