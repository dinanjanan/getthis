import { MeloModuleConstructor } from '../interfaces/types';
import { MeloModule } from '../modules/melo-module';
import { ModuleRegistry } from '../modules/module-registry';

export let rootModule: MeloModuleConstructor<any>;
export let moduleRegistry: ModuleRegistry<any>;

export function initializeMelo<T extends MeloModule>(
  root: MeloModuleConstructor<T>
): void {
  console.log('processing modules');
  rootModule = root;
  moduleRegistry = new ModuleRegistry(root);
  moduleRegistry.processModulesOnRegistration();

  console.log(moduleRegistry);
}
