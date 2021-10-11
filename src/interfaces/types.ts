import { MeloModule } from '../modules/melo-module';

// export type Contract<T extends MeloModule> =  MeloModuleConstructor<T>;
export type Contract = string;

// export type ContractImplementation<T extends MeloModule> =  MeloModuleConstructor<T>;
export type ContractImplementation<T = any> = new () => T;

// export type ContractImplementationMap = Map<
//   Contract<MeloModule>,
//   ContractImplementation<MeloModule>
// >;
export type ContractImplementationMap = {
  [contract: Contract]: ContractImplementation;
};

export enum DependencyType {
  SINGLETON,
  TRANSIENT,
}

export type ImplementationMetadata = {
  contract: Contract;
  implementation: ContractImplementation;
  module: MeloModule;
  type: DependencyType;
};

export type MeloModuleConstructor<T extends MeloModule> = (new (
  ...args: any
) => T) & {
  factory?: () => T;
};

export type InjectionClient = Function;
