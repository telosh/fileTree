#!/usr/bin/env node
import { setupTreeCommand } from './cli';

const program = setupTreeCommand();
program.parse(process.argv); 