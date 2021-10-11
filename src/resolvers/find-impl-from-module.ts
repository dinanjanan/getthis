import { moduleRegistry } from '../bootstrapper/initialize-melo';
import {
  Contract,
  ContractImplementation,
  DependencyType,
  ImplementationMetadata,
  InjectionClient,
  MeloModuleConstructor,
} from '../interfaces/types';

function resolveImpl<T extends Function>(
  currModuleCons: MeloModuleConstructor<any>,
  target: T,
  targetName: Contract
): ImplementationMetadata | null {
  const currModule = moduleRegistry.retrieveModule(currModuleCons);

  if (!currModule) {
    return null;
  }

  const singletonRef = Object.entries(currModule.single).find(
    entry => entry[0] === targetName
  );
  const transientRef = Object.entries(currModule.transient).find(
    entry => entry[0] === targetName
  );

  if (singletonRef || transientRef) {
    let ref: [Contract, ContractImplementation];
    let refType: DependencyType;

    if (singletonRef) {
      if (singletonRef && transientRef) {
        console.warn(
          `[MELO] Conflicting singleton and transient declarations of ${targetName} in module ${currModule}. Defaulting to singleton.`
        );
      }

      ref = singletonRef;
      refType = DependencyType.SINGLETON;
    } else {
      ref = transientRef!;
      refType = DependencyType.TRANSIENT;
    }

    const implMd: ImplementationMetadata = {
      contract: targetName,
      implementation: ref[1],
      module: currModule,
      type: refType,
    };

    return implMd;
  } else {
    const parentModule = moduleRegistry.getParentModule(currModuleCons);
    return resolveImpl(parentModule, target, targetName);
  }
}

export function resolveImplForClient<T extends Function>(
  client: InjectionClient,
  target: T,
  targetName: Contract
): ImplementationMetadata | null {
  const clientModuleCons = moduleRegistry.retrieveModuleForClient(client);

  console.log('resolving....');
  console.log('clientModuleCons:', clientModuleCons);
  console.log('target:', target);
  console.log('targetName:', targetName);
  console.log('client:', client);

  let implMd = resolveImpl(clientModuleCons, target, targetName);

  if (implMd === null) {
    const clientModule = moduleRegistry.retrieveModule(clientModuleCons);

    for (const importedModule of clientModule.useModules) {
      const importedImplMd = resolveImpl(importedModule, target, targetName);
      if (importedImplMd) {
        console.log(
          `imported ${target.name} from ${importedModule.name} for client ${client.name}`
        );
        implMd = importedImplMd;
        break;
      }
    }
  }

  return implMd;
}
