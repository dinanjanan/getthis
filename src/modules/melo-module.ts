import { ContractImplementationMap } from '../interfaces/types';

export class MeloModule {
  injectsInto: Function[] = [];

  single: ContractImplementationMap = {};
  transient: ContractImplementationMap = {};

  subModules: typeof MeloModule[] = [];
  useModules: typeof MeloModule[] = [];

  static factory?: () => MeloModule;
}
