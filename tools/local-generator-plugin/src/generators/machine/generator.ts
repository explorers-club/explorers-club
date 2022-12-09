import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { MachineGeneratorSchema } from './schema';

interface NormalizedSchema extends MachineGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MachineGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.project
    ? `${names(options.project).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const { root: projectRoot, sourceRoot: projectSourceRoot } =
    readProjectConfiguration(tree, options.project);

  return {
    ...options,
    projectName,
    projectRoot,
    projectSourceRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    uppercase,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectSourceRoot + '/' + options.directory,
    templateOptions
  );
}

export default async function (tree: Tree, options: MachineGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  // addProjectConfiguration(tree, normalizedOptions.projectName, {
  //   root: normalizedOptions.projectRoot,
  //   projectType: 'application',
  //   sourceRoot: normalizedOptions.projectRoot + '/src',
  //   targets: {
  //     build: {
  //       executor: '@explorers-club/local-generator-plugin:build',
  //     },
  //   },
  // });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function uppercase(val: string) {
  return val.toUpperCase();
}
