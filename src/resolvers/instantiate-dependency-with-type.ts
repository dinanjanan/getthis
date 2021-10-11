import {
  Contract,
  ContractImplementation,
  DependencyType,
} from '../interfaces/types';

const cache = new Map<Contract, ContractImplementation>();

export function instantiateDependencyWithType(
  contract: Contract,
  implementation: ContractImplementation,
  dependencyType: DependencyType = DependencyType.SINGLETON
) {
  if (dependencyType === DependencyType.SINGLETON) {
    let cachedInstance = cache.get(contract);
    if (!cachedInstance) {
      const instance = new implementation();
      cache.set(contract, instance);
      cachedInstance = instance;
    }

    return cachedInstance;
  }

  return new implementation();
}
