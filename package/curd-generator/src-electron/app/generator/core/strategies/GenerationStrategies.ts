import { GenerationContext } from "../types/GenerationContext";

/**
 * Strategy interface for different generation strategies
 */
export interface IGenerationStrategy {
  /**
   * Determines if this strategy applies to the given context
   */
  canHandle(context: GenerationContext): boolean;

  /**
   * Gets the output directory path for this strategy
   */
  getOutputPath(context: GenerationContext): string;

  /**
   * Gets the base template directory for this strategy
   */
  getTemplateBasePath(): string;

  /**
   * Gets strategy-specific template data
   */
  getStrategyTemplateData(context: GenerationContext): Record<string, any>;

  /**
   * Gets the strategy identifier
   */
  getStrategyName(): string;
}

/**
 * Backend generation strategy
 */
export class BackendStrategy implements IGenerationStrategy {
  canHandle(context: GenerationContext): boolean {
    return true; // Backend files are generated for all contexts
  }

  getOutputPath(context: GenerationContext): string {
    return context.backendPath;
  }

  getTemplateBasePath(): string {
    return 'backend';
  }

  getStrategyTemplateData(context: GenerationContext): Record<string, any> {
    return {
      backendPath: context.backendPath,
      nestjsDecorators: true,
      typeormEnabled: true,
    };
  }

  getStrategyName(): string {
    return 'backend';
  }
}

/**
 * Frontend generation strategy
 */
export class FrontendStrategy implements IGenerationStrategy {
  canHandle(context: GenerationContext): boolean {
    // Frontend files are optional based on project configuration
    return !!context.frontendPath;
  }

  getOutputPath(context: GenerationContext): string {
    return context.frontendPath;
  }

  getTemplateBasePath(): string {
    return 'frontend';
  }

  getStrategyTemplateData(context: GenerationContext): Record<string, any> {
    return {
      frontendPath: context.frontendPath,
      vueComponents: true,
      quasarFramework: true,
    };
  }

  getStrategyName(): string {
    return 'frontend';
  }
}

/**
 * Common generation strategy for shared files
 */
export class CommonStrategy implements IGenerationStrategy {
  canHandle(context: GenerationContext): boolean {
    return true; // Common files like interfaces are always generated
  }

  getOutputPath(context: GenerationContext): string {
    // Common files can go to either backend or a shared directory
    return context.backendPath;
  }

  getTemplateBasePath(): string {
    return 'common';
  }

  getStrategyTemplateData(context: GenerationContext): Record<string, any> {
    return {
      sharedTypes: true,
      commonInterfaces: true,
    };
  }

  getStrategyName(): string {
    return 'common';
  }
}

/**
 * Strategy context class that manages strategies
 */
export class StrategyContext {
  private strategies: IGenerationStrategy[] = [];

  constructor() {
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies(): void {
    this.strategies.push(
      new BackendStrategy(),
      new FrontendStrategy(),
      new CommonStrategy()
    );
  }

  /**
   * Gets the appropriate strategy for the given context
   */
  getStrategy(strategyName: string): IGenerationStrategy | null {
    return this.strategies.find(s => s.getStrategyName() === strategyName) || null;
  }

  /**
   * Gets all strategies that can handle the given context
   */
  getApplicableStrategies(context: GenerationContext): IGenerationStrategy[] {
    return this.strategies.filter(s => s.canHandle(context));
  }

  /**
   * Adds a custom strategy
   */
  addStrategy(strategy: IGenerationStrategy): void {
    this.strategies.push(strategy);
  }
}