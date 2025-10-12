const { validateConfig } = require('../schemas/appConfigSchema');
const ServiceNowClient = require('../api/ServiceNowClient');

/**
 * Dynamic App Generator - Main orchestrator for creating ServiceNow apps
 */
class DynamicAppGenerator {
  constructor(serviceNowClient) {
    this.client = serviceNowClient;
    this.generationLog = [];
  }

  /**
   * Generate a complete ServiceNow application from configuration
   * @param {Object} config - Application configuration
   * @returns {Object} Generation result
   */
  async generateApp(config) {
    try {
      // Validate configuration
      const { error, value } = validateConfig(config);
      if (error) {
        return {
          success: false,
          error: 'Configuration validation failed',
          details: error.details.map(d => d.message)
        };
      }

      const validConfig = value;
      const results = {
        success: true,
        appScope: validConfig.appScope,
        components: {}
      };

      // 1. Create Application
      this.log('Creating application...');
      const app = await this.client.createApplication(validConfig);
      results.components.application = app;

      // 2. Create Tables
      if (validConfig.tables && validConfig.tables.length > 0) {
        this.log(`Creating ${validConfig.tables.length} table(s)...`);
        results.components.tables = [];
        
        for (const table of validConfig.tables) {
          const tableResult = await this.client.createTable(table, validConfig.appScope);
          results.components.tables.push(tableResult);

          // Create fields for this table
          if (table.fields && table.fields.length > 0) {
            this.log(`Creating ${table.fields.length} field(s) for table ${table.name}...`);
            tableResult.fields = [];
            
            for (const field of table.fields) {
              const fieldResult = await this.client.createField(
                field, 
                `${validConfig.appScope}_${table.name}`,
                validConfig.appScope
              );
              tableResult.fields.push(fieldResult);
            }
          }
        }
      }

      // 3. Create Forms
      if (validConfig.forms && validConfig.forms.length > 0) {
        this.log(`Creating ${validConfig.forms.length} form(s)...`);
        results.components.forms = [];
        
        for (const form of validConfig.forms) {
          const formResult = await this.client.createForm(form, validConfig.appScope);
          results.components.forms.push(formResult);
        }
      }

      // 4. Create Business Rules
      if (validConfig.businessRules && validConfig.businessRules.length > 0) {
        this.log(`Creating ${validConfig.businessRules.length} business rule(s)...`);
        results.components.businessRules = [];
        
        for (const rule of validConfig.businessRules) {
          const ruleResult = await this.client.createBusinessRule(rule, validConfig.appScope);
          results.components.businessRules.push(ruleResult);
        }
      }

      // 5. Create UI Policies
      if (validConfig.uiPolicies && validConfig.uiPolicies.length > 0) {
        this.log(`Creating ${validConfig.uiPolicies.length} UI policy/policies...`);
        results.components.uiPolicies = [];
        
        for (const policy of validConfig.uiPolicies) {
          const policyResult = await this.client.createUIPolicy(policy, validConfig.appScope);
          results.components.uiPolicies.push(policyResult);
        }
      }

      // 6. Create Workflows
      if (validConfig.workflows && validConfig.workflows.length > 0) {
        this.log(`Creating ${validConfig.workflows.length} workflow(s)...`);
        results.components.workflows = [];
        
        for (const workflow of validConfig.workflows) {
          const workflowResult = await this.client.createWorkflow(workflow, validConfig.appScope);
          results.components.workflows.push(workflowResult);
        }
      }

      // 7. Create Roles
      if (validConfig.roles && validConfig.roles.length > 0) {
        this.log(`Creating ${validConfig.roles.length} role(s)...`);
        results.components.roles = [];
        
        for (const role of validConfig.roles) {
          const roleResult = await this.client.createRole(role, validConfig.appScope);
          results.components.roles.push(roleResult);
        }
      }

      // 8. Create Menus
      if (validConfig.menus && validConfig.menus.length > 0) {
        this.log(`Creating ${validConfig.menus.length} menu(s)...`);
        results.components.menus = [];
        
        for (const menu of validConfig.menus) {
          const menuResult = await this.client.createMenu(menu, validConfig.appScope);
          results.components.menus.push(menuResult);
        }
      }

      this.log('Application generation complete!');
      results.generationLog = this.generationLog;
      
      return results;

    } catch (error) {
      return {
        success: false,
        error: error.message,
        generationLog: this.generationLog
      };
    }
  }

  /**
   * Generate app from a template
   * @param {string} templateName - Name of the template to use
   * @param {Object} customization - Custom parameters
   */
  async generateFromTemplate(templateName, customization = {}) {
    const templates = require('../templates');
    const template = templates[templateName];
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Merge template with customization
    const config = this._mergeConfig(template, customization);
    
    return await this.generateApp(config);
  }

  /**
   * Log generation steps
   */
  log(message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message
    };
    this.generationLog.push(logEntry);
    console.log(`[${logEntry.timestamp}] ${message}`);
  }

  /**
   * Merge template with customization
   */
  _mergeConfig(template, customization) {
    return {
      ...template,
      ...customization,
      appName: customization.appName || template.appName,
      appScope: customization.appScope || template.appScope
    };
  }
}

module.exports = DynamicAppGenerator;
