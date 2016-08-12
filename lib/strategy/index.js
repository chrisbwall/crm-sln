
module.exports.rules = {
  uniqueName: (test) => {

  }
};

module.exports.defaults = {
  provideDefault: () => {
    return {
      uniqueName: null,
      version: "1.0.0",
      platform: 'OnPremise',
      targetVersion: null,
      defaultLanguage: 1033,
      isManaged: false,
      displayNames: {},
      descriptions: {},
      languages: [],
      publisher: {
        uniqueName: null,
        name: null,
        prefix: "new",
        address1: {},
        address2: {}
      },
      entities: [],
      webResources: [],
      pluginAssemblies: [],
      workflows: [],
      securityRoles: [],
      dashboards: [],
      reports: [],
      clientExtensions: []
    };
  },
  validate: (requiredFields, solution) => {

  }
};