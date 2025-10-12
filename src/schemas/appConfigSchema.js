const Joi = require('joi');

/**
 * Schema for validating app configuration
 */
const appConfigSchema = Joi.object({
  appName: Joi.string().required().min(3).max(50)
    .description('Name of the application'),
  
  appScope: Joi.string().required().pattern(/^x_[a-z0-9_]+$/)
    .description('ServiceNow application scope (must start with x_)'),
  
  description: Joi.string().required()
    .description('Application description'),
  
  tables: Joi.array().items(
    Joi.object({
      name: Joi.string().required()
        .description('Table name'),
      label: Joi.string().required()
        .description('Table label'),
      extends: Joi.string().default('task')
        .description('Parent table to extend from'),
      fields: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          type: Joi.string().valid(
            'string', 'integer', 'boolean', 'reference', 
            'date', 'datetime', 'choice', 'email', 'url'
          ).required(),
          label: Joi.string().required(),
          mandatory: Joi.boolean().default(false),
          maxLength: Joi.number().when('type', {
            is: 'string',
            then: Joi.number().max(4000),
            otherwise: Joi.forbidden()
          }),
          reference: Joi.string().when('type', {
            is: 'reference',
            then: Joi.string().required(),
            otherwise: Joi.forbidden()
          }),
          choices: Joi.array().items(
            Joi.object({
              value: Joi.string().required(),
              label: Joi.string().required()
            })
          ).when('type', {
            is: 'choice',
            then: Joi.array().min(1),
            otherwise: Joi.forbidden()
          })
        })
      ).default([])
    })
  ).default([]),
  
  forms: Joi.array().items(
    Joi.object({
      table: Joi.string().required(),
      view: Joi.string().default('default'),
      sections: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          fields: Joi.array().items(Joi.string()).required()
        })
      ).required()
    })
  ).default([]),
  
  businessRules: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      table: Joi.string().required(),
      when: Joi.string().valid('before', 'after', 'async', 'display').required(),
      operation: Joi.array().items(
        Joi.string().valid('insert', 'update', 'delete', 'query')
      ).required(),
      condition: Joi.string().allow(''),
      script: Joi.string().required()
    })
  ).default([]),
  
  uiPolicies: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      table: Joi.string().required(),
      onLoad: Joi.boolean().default(true),
      condition: Joi.string().allow(''),
      actions: Joi.array().items(
        Joi.object({
          field: Joi.string().required(),
          mandatory: Joi.boolean(),
          visible: Joi.boolean(),
          readOnly: Joi.boolean()
        })
      ).required()
    })
  ).default([]),
  
  workflows: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      table: Joi.string().required(),
      description: Joi.string().allow(''),
      activities: Joi.array().items(
        Joi.object({
          type: Joi.string().valid('approval', 'notification', 'script', 'condition').required(),
          name: Joi.string().required(),
          config: Joi.object().required()
        })
      ).default([])
    })
  ).default([]),
  
  roles: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      elevatePrivilege: Joi.boolean().default(false)
    })
  ).default([]),
  
  menus: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      title: Joi.string().required(),
      table: Joi.string(),
      type: Joi.string().valid('list', 'form', 'separator', 'module').required(),
      roles: Joi.array().items(Joi.string()).default([])
    })
  ).default([])
});

module.exports = {
  appConfigSchema,
  
  /**
   * Validate app configuration
   * @param {Object} config - App configuration object
   * @returns {Object} Validation result
   */
  validateConfig: (config) => {
    return appConfigSchema.validate(config, { abortEarly: false });
  }
};
