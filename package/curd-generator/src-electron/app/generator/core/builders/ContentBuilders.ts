import { GenerationContext } from "../types/GenerationContext";
import { AttrConfig } from "../../../type/JsonFileDefine/Attr";

/**
 * Interface for content builders
 */
export interface IContentBuilder {
  reset(): IContentBuilder;
  build(): string;
}

/**
 * Abstract base builder with common functionality
 */
export abstract class BaseContentBuilder implements IContentBuilder {
  protected content: string[] = [];
  protected imports: Set<string> = new Set();
  protected context: GenerationContext;

  constructor(context: GenerationContext) {
    this.context = context;
  }

  reset(): IContentBuilder {
    this.content = [];
    this.imports.clear();
    return this;
  }

  abstract build(): string;

  protected addLine(line: string): void {
    this.content.push(line);
  }

  protected addLines(lines: string[]): void {
    this.content.push(...lines);
  }

  protected addImport(importStatement: string): void {
    this.imports.add(importStatement);
  }
}

/**
 * Class builder for TypeScript classes
 */
export class ClassBuilder extends BaseContentBuilder {
  private className: string = '';
  private extends: string = '';
  private implements: string[] = [];
  private decorators: string[] = [];
  private properties: string[] = [];
  private constructorContent: string[] = [];
  private methods: string[] = [];

  setClassName(name: string): ClassBuilder {
    this.className = name;
    return this;
  }

  addDecorator(decorator: string): ClassBuilder {
    this.decorators.push(decorator);
    return this;
  }

  setExtends(extendsClass: string): ClassBuilder {
    this.extends = extendsClass;
    return this;
  }

  addImplements(interfaceName: string): ClassBuilder {
    this.implements.push(interfaceName);
    return this;
  }

  addProperty(property: string): ClassBuilder {
    this.properties.push(property);
    return this;
  }

  addConstructorParam(param: string): ClassBuilder {
    this.constructorContent.push(param);
    return this;
  }

  addMethod(method: string): ClassBuilder {
    this.methods.push(method);
    return this;
  }

  build(): string {
    const result: string[] = [];

    // Add imports
    if (this.imports.size > 0) {
      result.push(...Array.from(this.imports));
      result.push('');
    }

    // Add decorators
    this.decorators.forEach(decorator => {
      result.push(decorator);
    });

    // Class declaration
    let classDeclaration = `export class ${this.className}`;
    
    if (this.extends) {
      classDeclaration += ` extends ${this.extends}`;
    }

    if (this.implements.length > 0) {
      classDeclaration += ` implements ${this.implements.join(', ')}`;
    }

    result.push(`${classDeclaration} {`);

    // Add properties
    if (this.properties.length > 0) {
      this.properties.forEach(property => {
        result.push(`  ${property}`);
      });
      result.push('');
    }

    // Add constructor
    if (this.constructorContent.length > 0) {
      result.push('  constructor(');
      this.constructorContent.forEach((param, index) => {
        const comma = index < this.constructorContent.length - 1 ? ',' : '';
        result.push(`    ${param}${comma}`);
      });
      result.push('  ) {}');
      result.push('');
    }

    // Add methods
    this.methods.forEach(method => {
      result.push(`  ${method}`);
      result.push('');
    });

    result.push('}');

    return result.join('\n');
  }
}

/**
 * Interface builder for TypeScript interfaces
 */
export class InterfaceBuilder extends BaseContentBuilder {
  private interfaceName: string = '';
  private extends: string[] = [];
  private properties: string[] = [];

  setInterfaceName(name: string): InterfaceBuilder {
    this.interfaceName = name;
    return this;
  }

  addExtends(extendsInterface: string): InterfaceBuilder {
    this.extends.push(extendsInterface);
    return this;
  }

  addProperty(property: string): InterfaceBuilder {
    this.properties.push(property);
    return this;
  }

  build(): string {
    const result: string[] = [];

    // Add imports
    if (this.imports.size > 0) {
      result.push(...Array.from(this.imports));
      result.push('');
    }

    // Interface declaration
    let interfaceDeclaration = `export interface ${this.interfaceName}`;
    
    if (this.extends.length > 0) {
      interfaceDeclaration += ` extends ${this.extends.join(', ')}`;
    }

    result.push(`${interfaceDeclaration} {`);

    // Add properties
    this.properties.forEach(property => {
      result.push(`  ${property}`);
    });

    result.push('}');

    return result.join('\n');
  }
}

/**
 * Entity builder for TypeORM entities
 */
export class EntityBuilder extends ClassBuilder {
  addEntityDecorator(tableName: string): EntityBuilder {
    this.addDecorator(`@Entity('${tableName}')`);
    this.addImport("import { Entity } from 'typeorm';");
    return this;
  }

  addColumn(attr: AttrConfig): EntityBuilder {
    const columnOptions = this.buildColumnOptions(attr);
    const decorator = `@Column(${columnOptions})`;
    const property = `${attr.name}: ${this.mapTypeToTypeScript(attr.type)};`;
    
    this.addProperty(`${decorator}\n  ${property}`);
    this.addImport("import { Column } from 'typeorm';");
    return this;
  }

  addPrimaryColumn(attr: AttrConfig): EntityBuilder {
    if (attr.type === 'increment_id') {
      this.addProperty(`@PrimaryGeneratedColumn()\n  ${attr.name}: number;`);
      this.addImport("import { PrimaryGeneratedColumn } from 'typeorm';");
    } else {
      this.addProperty(`@PrimaryColumn()\n  ${attr.name}: ${this.mapTypeToTypeScript(attr.type)};`);
      this.addImport("import { PrimaryColumn } from 'typeorm';");
    }
    return this;
  }

  private buildColumnOptions(attr: AttrConfig): string {
    const options: string[] = [];
    
    if (attr.nullable) {
      options.push('nullable: true');
    }
    
    if (attr.length) {
      options.push(`length: ${attr.length}`);
    }

    return options.length > 0 ? `{ ${options.join(', ')} }` : '';
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'Date',
      'json': 'any',
      'increment_id': 'number',
      'created_time': 'Date',
      'updated_time': 'Date',
      'delete_time': 'Date'
    };

    return typeMap[type] || 'any';
  }
}

/**
 * Director class to orchestrate complex builds
 */
export class GenerationDirector {
  private context: GenerationContext;

  constructor(context: GenerationContext) {
    this.context = context;
  }

  buildControllerClass(modelName: string): string {
    const builder = new ClassBuilder(this.context);
    
    return builder
      .reset()
      .setClassName(`${modelName}Controller`)
      .addDecorator('@Controller()')
      .addConstructorParam(`private readonly service: ${modelName}Service`)
      .addMethod(`// Controller methods will be added here`)
      .build();
  }

  buildServiceClass(modelName: string): string {
    const builder = new ClassBuilder(this.context);
    
    return builder
      .reset()
      .setClassName(`${modelName}Service`)
      .addDecorator('@Injectable()')
      .addConstructorParam(`@InjectRepository(${modelName}) private repository: Repository<${modelName}>`)
      .addMethod(`// Service methods will be added here`)
      .build();
  }

  buildEntityClass(modelConfig: any): string {
    const builder = new EntityBuilder(this.context);
    
    builder
      .reset()
      .setClassName(modelConfig.name)
      .addEntityDecorator(modelConfig.dbName);

    // Add attributes as columns
    if (modelConfig.attrs) {
      modelConfig.attrs.forEach((attr: AttrConfig) => {
        if (attr.type === 'increment_id') {
          builder.addPrimaryColumn(attr);
        } else {
          builder.addColumn(attr);
        }
      });
    }

    return builder.build();
  }
}