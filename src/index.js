const DynamicAppGenerator = require('./generators/DynamicAppGenerator');
const ServiceNowClient = require('./api/ServiceNowClient');
const { validateConfig } = require('./schemas/appConfigSchema');
const templates = require('./templates');

/**
 * Main entry point for the Dynamic App Generator
 */
class DynamicAppFactory {
  /**
   * Create a new app generator instance
   * @param {string} instanceUrl - ServiceNow instance URL
   * @param {string} username - ServiceNow username
   * @param {string} password - ServiceNow password
   */
  static createGenerator(instanceUrl, username, password) {
    const client = new ServiceNowClient(instanceUrl, username, password);
    return new DynamicAppGenerator(client);
  }

  /**
   * Validate an app configuration
   * @param {Object} config - App configuration to validate
   */
  static validateConfiguration(config) {
    return validateConfig(config);
  }

  /**
   * Get available templates
   */
  static getTemplates() {
    return Object.keys(templates);
  }

  /**
   * Get a specific template
   * @param {string} templateName - Name of the template
   */
  static getTemplate(templateName) {
    return templates[templateName];
  }

  /**
   * Generate app from configuration
   * @param {Object} config - App configuration
   * @param {string} instanceUrl - ServiceNow instance URL
   * @param {string} username - ServiceNow username
   * @param {string} password - ServiceNow password
   */
  static async generateApp(config, instanceUrl, username, password) {
    const generator = this.createGenerator(instanceUrl, username, password);
    return await generator.generateApp(config);
  }

  /**
   * Generate app from template
   * @param {string} templateName - Template name
   * @param {Object} customization - Custom parameters
   * @param {string} instanceUrl - ServiceNow instance URL
   * @param {string} username - ServiceNow username
   * @param {string} password - ServiceNow password
   */
  static async generateFromTemplate(templateName, customization, instanceUrl, username, password) {
    const generator = this.createGenerator(instanceUrl, username, password);
    return await generator.generateFromTemplate(templateName, customization);
  }
}

module.exports = DynamicAppFactory;
