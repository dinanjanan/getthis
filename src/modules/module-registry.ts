import { InjectionClient, MeloModuleConstructor } from '../interfaces/types';
import { MeloModule } from './melo-module';

export class ModuleRegistry<R extends MeloModule> {
  private moduleRegistry = new Map<MeloModuleConstructor<any>, MeloModule>();
  private clientRegistry = new Map<
    InjectionClient,
    MeloModuleConstructor<any>
  >();
  private moduleParentRegistry = new Map<
    MeloModuleConstructor<any>,
    MeloModuleConstructor<any> | null
  >();

  constructor(private rootModuleCons: MeloModuleConstructor<R>) {}

  private registerModule<T extends MeloModule>(
    parentModule: MeloModuleConstructor<T> | null,
    module: MeloModuleConstructor<T>
  ) {
    let moduleInstance = this.moduleRegistry.get(module);
    if (!moduleInstance) {
      console.log('processing subModule:', module);
      moduleInstance = module.factory?.() ?? new module();
      this.moduleRegistry.set(module, moduleInstance);

      // const alreadyRegisteredParent = this.moduleParentRegistry.get(module);
      // console.log('alreadyRegisteredParent:', module, alreadyRegisteredParent);
      this.moduleParentRegistry.set(module, parentModule);
    } else {
      throw new Error(
        `[MELO] Module ${module.name} is already declared as a sub-module by ${
          this.moduleParentRegistry.get(module)?.name
        }. Please remove the conflicting declaration from ${
          parentModule?.name
        }, or include it in the useModules array`
      );
    }
  }

  private registerClientsWithModule<T extends MeloModule>(
    moduleCons: MeloModuleConstructor<T>
  ) {
    let moduleInstance = this.moduleRegistry.get(moduleCons);
    if (!moduleInstance) {
      console.error(
        `[MELO] Attempting to register clients of a non-existent module ${moduleCons.name}`
      );
      return;
    }

    for (const client of moduleInstance.injectsInto) {
      const clientModule = this.clientRegistry.get(client);
      // console.log(moduleCons, client, clientModule);
      if (!clientModule) {
        console.log('registered');
        this.clientRegistry.set(client, moduleCons);
      } else {
        console.warn(
          `[MELO] ${client.name} has already been registered with the module ${clientModule.name}. Please remove it from ${moduleCons.name} Skipping...`
        );
      }
    }
  }

  private processSubModules<T extends MeloModule>(
    moduleCons: MeloModuleConstructor<T>
  ) {
    const module = this.moduleRegistry.get(moduleCons)!;

    for (const subModule of module.subModules) {
      this.registerModule(moduleCons, subModule);
      this.processSubModules(subModule);
      this.registerClientsWithModule(subModule);
    }
  }

  public processModulesOnRegistration() {
    this.registerModule(null, this.rootModuleCons);
    this.processSubModules(this.rootModuleCons);
    this.registerClientsWithModule(this.rootModuleCons);
  }

  public retrieveModule<T extends MeloModule>(
    module: MeloModuleConstructor<T>
  ) {
    return this.moduleRegistry.get(module)!;
  }

  public retrieveModuleForClient(client: InjectionClient) {
    return this.clientRegistry.get(client)!;
  }

  public getParentModule(module: MeloModuleConstructor<any>) {
    return this.moduleParentRegistry.get(module)!;
  }
}
