# Architecture Documentation

## System Overview

The ServiceNow Dynamic Apps Generator is a configuration-driven framework that enables runtime generation of ServiceNow applications based on user requirements. The system follows a modular architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  CLI Tool    │  │  REST API    │  │  Web Interface   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Factory Layer                  │
│                   (DynamicAppFactory)                        │
│  • Facade for all operations                                │
│  • Template management                                       │
│  • Validation orchestration                                  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
│  Schema Layer    │ │  Generator   │ │  Template       │
│                  │ │   Layer      │ │   Library       │
│  • Validation    │ │              │ │                 │
│  • Type checking │ │  • Component │ │  • Ticketing    │
│  • Constraints   │ │    creation  │ │  • Assets       │
│                  │ │  • Workflow  │ │  • Projects     │
└──────────────────┘ └──────────────┘ └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ServiceNow API Layer                      │
│  • Authentication                                            │
│  • Table/Field creation                                      │
│  • Business Rule creation                                    │
│  • UI Policy creation                                        │
│  • Workflow creation                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  ServiceNow     │
                    │  Instance       │
                    └─────────────────┘
```

## Component Description

### 1. User Interface Layer

#### CLI Tool (`cli.js`)
- Command-line interface for developers
- Commands: list-templates, generate, validate, sample
- Environment variable based configuration
- File-based input/output

### 2. Application Factory Layer (`src/index.js`)

**DynamicAppFactory** - Main facade providing:
- `createGenerator()`: Factory method for generator instances
- `validateConfiguration()`: Configuration validation
- `getTemplates()`: Template discovery
- `generateApp()`: App generation from config
- `generateFromTemplate()`: Template-based generation

### 3. Schema Layer (`src/schemas/`)

**appConfigSchema.js** - Configuration validation using Joi

### 4. Generator Layer (`src/generators/`)

**DynamicAppGenerator** - Main orchestrator for component creation

### 5. ServiceNow API Layer (`src/api/`)

**ServiceNowClient** - API wrapper for ServiceNow operations

### 6. Template Library (`src/templates/`)

Pre-built templates for common use cases:
- Ticketing System
- Asset Management
- Project Management

## Key Design Patterns

1. **Factory Pattern**: DynamicAppFactory creates generator instances
2. **Builder Pattern**: DynamicAppGenerator builds complex applications step-by-step
3. **Strategy Pattern**: Different templates as strategies
4. **Facade Pattern**: Simple interface hiding complex subsystem interactions
