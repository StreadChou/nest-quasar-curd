import { ITemplateProvider, ITemplateEngine } from "../interfaces/ITemplateProvider";

/**
 * File-based template provider
 * Loads templates from the file system
 */
export class FileTemplateProvider implements ITemplateProvider {
  private templates = new Map<string, string>();
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  getTemplate(templateKey: string): string {
    if (!this.templates.has(templateKey)) {
      const templateContent = this.loadTemplateFromFile(templateKey);
      this.templates.set(templateKey, templateContent);
    }

    return this.templates.get(templateKey) || '';
  }

  hasTemplate(templateKey: string): boolean {
    return this.templates.has(templateKey) || this.templateFileExists(templateKey);
  }

  getAvailableTemplates(): string[] {
    // This would scan the template directory and return available templates
    return Array.from(this.templates.keys());
  }

  private loadTemplateFromFile(templateKey: string): string {
    // In a real implementation, this would load from file system
    // For now, return embedded templates
    return this.getEmbeddedTemplate(templateKey);
  }

  private templateFileExists(templateKey: string): boolean {
    // Check if template file exists
    return this.getEmbeddedTemplate(templateKey) !== '';
  }

  private getEmbeddedTemplate(templateKey: string): string {
    const templates: Record<string, string> = {
      'backend-controller': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

{{#if controllerDecorator}}@Controller('{{controllerPath}}'){{/if}}
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class {{className}} {{#if extendsClass}}extends {{extendsClass}}{{/if}} {
    constructor(
        {{#if constructorParams}}{{#each constructorParams}}{{this}}{{#unless @last}},{{/unless}}{{/each}}{{/if}}
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        {{#if superCall}}super({{superCall}});{{/if}}
        // CUSTOMER CONTENT_CONTENT START
        // CUSTOMER CONTENT_CONTENT END
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}`,

      'backend-service': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Injectable()
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class {{className}} {{#if extendsClass}}extends {{extendsClass}}{{/if}} {
    constructor(
        {{#if repositoryInjection}}@InjectRepository({{entityName}}) private repository: Repository<{{entityName}}>,{{/if}}
        {{#if constructorParams}}{{#each constructorParams}}{{this}}{{#unless @last}},{{/unless}}{{/each}}{{/if}}
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        {{#if superCall}}super({{superCall}});{{/if}}
        // CUSTOMER CONTENT_CONTENT START
        // CUSTOMER CONTENT_CONTENT END
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}`,

      'backend-entity': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Entity('{{tableName}}')
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class {{className}} {
    {{#each columns}}
    {{#if isPrimary}}
    @PrimaryGeneratedColumn()
    {{else}}
    @Column({{#if columnOptions}}{{{columnOptions}}}{{/if}})
    {{/if}}
    {{name}}: {{type}};

    {{/each}}
    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}`,

      'backend-module': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Module({
    imports: [
        {{#each imports}}{{this}}{{#unless @last}},{{/unless}}{{/each}}
        // CUSTOMER IMPORTS START
        // CUSTOMER IMPORTS END
    ],
    controllers: [
        {{#each controllers}}{{this}}{{#unless @last}},{{/unless}}{{/each}}
        // CUSTOMER CONTROLLERS START
        // CUSTOMER CONTROLLERS END
    ],
    providers: [
        {{#each providers}}{{this}}{{#unless @last}},{{/unless}}{{/each}}
        // CUSTOMER PROVIDERS START
        // CUSTOMER PROVIDERS END
    ],
    exports: [
        {{#each exports}}{{this}}{{#unless @last}},{{/unless}}{{/each}}
        // CUSTOMER EXPORTS START
        // CUSTOMER EXPORTS END
    ]
})
export class {{className}} {}`,

      'interface': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

export interface {{interfaceName}} {{#if extends}}extends {{extends}}{{/if}} {
    {{#each properties}}{{name}}: {{type}};{{/each}}
    // CUSTOMER PROPERTIES START
    // CUSTOMER PROPERTIES END
}`,

      'constants': `// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

{{#each constants}}
export const {{name}} = {{value}};
{{/each}}

// CUSTOMER CONSTANTS START
// CUSTOMER CONSTANTS END`
    };

    return templates[templateKey] || '';
  }
}

/**
 * Simple template engine using Handlebars-like syntax
 */
export class SimpleTemplateEngine implements ITemplateEngine {
  process(template: string, data: Record<string, any>): string {
    let result = template;

    // Handle simple variable replacements {{variable}}
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      return this.getValue(data, trimmedKey) || match;
    });

    // Handle conditionals {{#if condition}}...{{/if}}
    result = result.replace(/\{\{#if\s+([^}]+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
      const value = this.getValue(data, condition.trim());
      return value ? content : '';
    });

    // Handle loops {{#each array}}...{{/each}}
    result = result.replace(/\{\{#each\s+([^}]+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayName, content) => {
      const array = this.getValue(data, arrayName.trim());
      if (!Array.isArray(array)) return '';

      return array.map((item, index) => {
        let itemContent = content;
        
        // Replace {{this}} with current item
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
        
        // Replace {{@last}} for last item check
        itemContent = itemContent.replace(/\{\{#unless @last\}\}/g, index < array.length - 1 ? '' : '<!--');
        itemContent = itemContent.replace(/\{\{\/unless\}\}/g, index < array.length - 1 ? '' : '-->');
        
        // Handle object properties if item is an object
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            itemContent = itemContent.replace(regex, String(item[key]));
          });
        }

        return itemContent;
      }).join('');
    });

    // Clean up any remaining template artifacts
    result = result.replace(/<!--.*?-->/g, '');

    return result;
  }

  validateTemplate(template: string): boolean {
    try {
      // Basic validation - check for balanced braces
      const openBraces = (template.match(/\{\{/g) || []).length;
      const closeBraces = (template.match(/\}\}/g) || []).length;
      return openBraces === closeBraces;
    } catch {
      return false;
    }
  }

  private getValue(data: Record<string, any>, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], data);
  }
}

/**
 * Template manager that combines provider and engine
 */
export class TemplateManager {
  private provider: ITemplateProvider;
  private engine: ITemplateEngine;

  constructor(provider: ITemplateProvider, engine: ITemplateEngine) {
    this.provider = provider;
    this.engine = engine;
  }

  processTemplate(templateKey: string, data: Record<string, any>): string {
    const template = this.provider.getTemplate(templateKey);
    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    if (!this.engine.validateTemplate(template)) {
      throw new Error(`Invalid template syntax: ${templateKey}`);
    }

    return this.engine.process(template, data);
  }

  hasTemplate(templateKey: string): boolean {
    return this.provider.hasTemplate(templateKey);
  }

  getAvailableTemplates(): string[] {
    return this.provider.getAvailableTemplates();
  }
}