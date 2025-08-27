/**
 * Interface for template providers
 * Following Single Responsibility Principle - only handles template management
 */
export interface ITemplateProvider {
  /**
   * Gets template content by template key
   * @param templateKey Unique identifier for the template
   * @returns Template content as string
   */
  getTemplate(templateKey: string): string;

  /**
   * Checks if template exists
   * @param templateKey Template key to check
   * @returns true if template exists, false otherwise
   */
  hasTemplate(templateKey: string): boolean;

  /**
   * Gets all available template keys
   * @returns Array of template keys
   */
  getAvailableTemplates(): string[];
}

/**
 * Interface for template engines
 * Following Single Responsibility Principle - only handles template processing
 */
export interface ITemplateEngine {
  /**
   * Processes template with provided data
   * @param template Template content
   * @param data Data to be used in template processing
   * @returns Processed template content
   */
  process(template: string, data: Record<string, any>): string;

  /**
   * Validates template syntax
   * @param template Template content to validate
   * @returns true if template is valid, false otherwise
   */
  validateTemplate(template: string): boolean;
}