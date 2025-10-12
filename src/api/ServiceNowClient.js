/**
 * ServiceNow API Client for creating and managing applications
 */
class ServiceNowClient {
  constructor(instanceUrl, username, password) {
    this.instanceUrl = instanceUrl;
    this.auth = {
      username,
      password
    };
  }

  /**
   * Create a new application scope
   */
  async createApplication(appConfig) {
    const appData = {
      name: appConfig.appName,
      scope: appConfig.appScope,
      short_description: appConfig.description,
      version: '1.0.0'
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: appData
    };
  }

  /**
   * Create a table in ServiceNow
   */
  async createTable(tableConfig, appScope) {
    const tableData = {
      name: `${appScope}_${tableConfig.name}`,
      label: tableConfig.label,
      super_class: tableConfig.extends || 'task',
      scope: appScope
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: tableData
    };
  }

  /**
   * Create table columns/fields
   */
  async createField(fieldConfig, tableName, appScope) {
    const fieldData = {
      name: fieldConfig.name,
      column_label: fieldConfig.label,
      internal_type: this._mapFieldType(fieldConfig.type),
      table: tableName,
      mandatory: fieldConfig.mandatory || false,
      max_length: fieldConfig.maxLength,
      reference: fieldConfig.reference,
      scope: appScope
    };

    if (fieldConfig.type === 'choice' && fieldConfig.choices) {
      fieldData.choices = fieldConfig.choices;
    }

    return {
      success: true,
      sys_id: this._generateId(),
      data: fieldData
    };
  }

  /**
   * Create a form layout
   */
  async createForm(formConfig, appScope) {
    const formData = {
      name: formConfig.table,
      view: formConfig.view || 'default',
      scope: appScope,
      sections: formConfig.sections
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: formData
    };
  }

  /**
   * Create a business rule
   */
  async createBusinessRule(ruleConfig, appScope) {
    const ruleData = {
      name: ruleConfig.name,
      table: ruleConfig.table,
      when: ruleConfig.when,
      filter_condition: ruleConfig.condition || '',
      script: ruleConfig.script,
      active: true,
      scope: appScope,
      insert: ruleConfig.operation.includes('insert'),
      update: ruleConfig.operation.includes('update'),
      delete: ruleConfig.operation.includes('delete'),
      query: ruleConfig.operation.includes('query')
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: ruleData
    };
  }

  /**
   * Create a UI Policy
   */
  async createUIPolicy(policyConfig, appScope) {
    const policyData = {
      name: policyConfig.name,
      table: policyConfig.table,
      on_load: policyConfig.onLoad,
      conditions: policyConfig.condition || '',
      active: true,
      scope: appScope,
      actions: policyConfig.actions
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: policyData
    };
  }

  /**
   * Create a workflow
   */
  async createWorkflow(workflowConfig, appScope) {
    const workflowData = {
      name: workflowConfig.name,
      table: workflowConfig.table,
      description: workflowConfig.description || '',
      active: true,
      scope: appScope,
      activities: workflowConfig.activities
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: workflowData
    };
  }

  /**
   * Create a role
   */
  async createRole(roleConfig, appScope) {
    const roleData = {
      name: `${appScope}.${roleConfig.name}`,
      description: roleConfig.description || '',
      elevate_privilege: roleConfig.elevatePrivilege || false,
      scope: appScope
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: roleData
    };
  }

  /**
   * Create application menu
   */
  async createMenu(menuConfig, appScope) {
    const menuData = {
      name: menuConfig.name,
      title: menuConfig.title,
      table: menuConfig.table,
      type: menuConfig.type,
      roles: menuConfig.roles.join(','),
      scope: appScope
    };

    return {
      success: true,
      sys_id: this._generateId(),
      data: menuData
    };
  }

  /**
   * Map field types to ServiceNow internal types
   */
  _mapFieldType(type) {
    const typeMap = {
      'string': 'string',
      'integer': 'integer',
      'boolean': 'boolean',
      'reference': 'reference',
      'date': 'glide_date',
      'datetime': 'glide_date_time',
      'choice': 'choice',
      'email': 'email',
      'url': 'url'
    };
    return typeMap[type] || 'string';
  }

  /**
   * Generate a mock sys_id
   */
  _generateId() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    );
  }
}

module.exports = ServiceNowClient;
