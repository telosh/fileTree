import { OptionValues } from 'commander';

export interface ProgramOptions extends OptionValues {
  level?: string;
  output?: string;
  exclude?: string;
  icons?: boolean;
  metadata?: boolean;
  sizeOnly?: boolean;
  sizeUnit?: string;
  useGitignore?: boolean;
}

export interface TreeOptions {
  level: number;
  exclude: string[];
  icons: boolean;
  metadata: boolean;
  sizeOnly: boolean;
  sizeUnit: string;
  useGitignore: boolean;
} 