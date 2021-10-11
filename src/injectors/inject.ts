import { extractIdentifierName } from '../utils/extract-identifier-name';
import { instantiateDependencyWithType } from '../resolvers/instantiate-dependency-with-type';
import { resolveImplForClient } from '../resolvers/find-impl-from-module';
import { InjectionClient } from '../interfaces/types';

function inject<T extends Function>(client: InjectionClient, target: T): T {
  console.log('\ntarget:', target);

  const targetName: string = extractIdentifierName(target);
  const ref = resolveImplForClient(client, target, targetName);

  if (!ref) {
    throw new Error(`[MELO] No implementation found for ${targetName}`);
  }

  console.log(
    'implementation:',
    {
      ...ref,
      module: 'Omitted from this log for clarity',
    },
    '\n'
  );

  return instantiateDependencyWithType(
    targetName,
    ref.implementation,
    ref.type
  ) as T;
}

export function createInject<T extends Function>(
  client: InjectionClient
): (target: T) => T {
  return function (target: T) {
    return inject(client, target);
  };
}
