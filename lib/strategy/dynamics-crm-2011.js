"use strict";

const ProgressPromise = require("../progress-promise");
const common = require("./index");

const rootComponentTypes = Object.freeze({
  Entity: 1,
	Attribute: 2,
	Relationship: 3,
	AttributePicklistValue: 4,
	AttributeLookupValue: 5,
	ViewAttribute: 6,
	LocalizedLabel: 7,
	RelationshipExtraCondition: 8,
	OptionSet: 9,
	EntityRelationship: 10,
	EntityRelationshipRole: 11,
	EntityRelationshipRelationships: 12,
	ManagedProperty: 13,
	Role: 20,
	RolePrivilege: 21,
	DisplayString: 22,
	DisplayStringMap: 23,
	Form: 24,
	Organization: 25,
	SavedQuery: 26,
	Workflow: 29,
	Report: 31,
	ReportEntity: 32,
	ReportCategory: 33,
	ReportVisibility: 34,
	Attachment: 35,
	EmailTemplate: 36,
	ContractTemplate: 37,
	KBArticleTemplate: 38,
	MailMergeTemplate: 39,
	DuplicateRule: 44,
	DuplicateRuleCondition: 45,
	EntityMap: 46,
	AttributeMap: 47,
	RibbonCommand: 48,
	RibbonContextGroup: 49,
	RibbonCustomization: 50,
	RibbonRule: 52,
	RibbonTabToCommandMap: 53,
	RibbonDiff: 55,
	SavedQueryVisualization: 59,
	SystemForm: 60,
	WebResource: 61,
	SiteMap: 62,
	ConnectionRole: 63,
	FieldSecurityProfile: 70,
	FieldPermission: 71,
	PluginType: 90,
	PluginAssembly: 91,
	SDKMessageProcessingStep: 92,
	SDKMessageProcessingStepImage: 93,
	ServiceEndpoint: 95
});

const languageCodes = Object.freeze({
  Arabic: -1,
  Basque: -1,
  Bulgarian: -1,
  Catalan: -1,
  ChineseHongKong: -1,
  ChineseSimplified: -1,
  ChineseTraditional: -1,
  Croation: -1,
  Czech: -1,
  Danish: -1,
  Dutch: 1043,
  English: 1033,
  Estonian: -1,
  Finnish: -1,
  French: 1036,
  Galician: -1,
  German: 1031,
  Greek: -1,
  Hebrew: -1,
  Hindi: -1,
  Hungarian: -1,
  Indonesian: -1,
  Italian: -1,
  Japanese: 1041,
  Kazakh: -1,
  Korean: -1,
  Latvian: -1,
  Lithuanian: -1,
  Malay: -1,
  Norwegian: -1,
  Polish: -1,
  PortugueseBrazil: -1,
  PortuguesePortugal: -1,
  Romanian: -1,
  Russian: -1,
  SerbianCyrillic: -1,
  SerbianLatin: -1,
  Slovak: -1,
  Slovenian: -1,
  Spanish: 3082,
  Swedish: -1,
  Thai: -1,
  Turkish: -1,
  Ukrainian: -1,
  Vietnamese: -1
});

const validate = (solution) => {
  let errors = [];

  let slnrules = { 
    "uniqueName": common.rules.uniqueName, 
    "targetVersion": common.rules.targetVersion,
    "displayName": common.rules.displayName
  };

  for (let r in slnrules) {
    if (slnrules[r](solution[r]) === false) {
      errors.push(`Solution#${r} validation failed.`);
    }
  }

  return { isValid: (errors.length === 0), errors };
};

/**
 * Takes SolutionFilesMap instance and transform it into a normalized object
 *  which can be used to generate the solution XML files.
 * 
 * @param {Object} SolutionFilesMap object
 * @returns {Object} returns SolutionFiles object
 */
const make = (solution) => {
  return new ProgressPromise((resolve, reject, report) => {
    try {
      // -- validate
      report(1, "Validating solution data...");
      let validationResult = validate(solution);
      if (validationResult.isValid === false) {
        report(100, "Error encountered so exiting.");
        reject(new Error("Validation Errors: \n" + validationResult.errors.join("\n")));
      }

      const makeLocalizationArray = (loc) => {
        let names = [];
        for (let p in loc) {
          names.push({ description: loc[p], languagecode: p });
        }

        return names;
      };

      const makeAddressObject = (num, address) => {
        return {
          AddressNumber: { "": num },
          AddressTypeCode: { "": 1 },
          City: { "": address.city },
          County: { "": address.county },
          Country: { "": address.country },
          Fax: { "": address.fax},
          FreightTermsCode: { "": address.freightTermsCode },
          ImportSequenceNumber: { "": address.importSequenceNumber },
          Latitude: { "": address.latitude },
          Line1: { "": address.line1 },
          Line2: { "": address.line2 },
          Line3: { "": address.line3 },
          Longitude: { "": address.longitude },
          Name: { "": address.name },
          PostalCode: { "": address.postalCode },
          PostOfficeBox: { "": address.poBox },
          PrimaryContactName: { "": address.primaryContactName },
          ShippingMethodcode: { "": address.shippingMethodCode },
          StateOrProvince: { "": address.state },
          Telephone1: { "": address.telephone1 },
          Telephone2: { "": address.telephone2 },
          Telephone3: { "": address.telephone3 },
          TimeZoneRuleVersionNumber: { "": address.timeZoneRuleVersionNumber },
          UPSZone: { "": address.upsZone },
          UTCOffset: { "": address.utcOffset },
          UTCConversionTimeZoneCode: { "": address.utcConversionTimeZoneCode }
        };
      };

      const bInt = (b => ((b === true) ? 1 : 0));
      const publisher = Object.assign(defaultPublisher, solution.publisher);

      // -- build the various file objects
      const solutionMap = {
        version: solution.targetVersion, 
        minimumversion: "5.0",
        languagecode: solution.defaultLanguage,
        generatedBy: solution.platform, 
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        SolutionManifest: {
          UniqueName: { "": solution.uniqueName },
          LocalizedNames: {
            LocalizedName: makeLocalizationArray(solution.displayNames)
          },
          Descriptions: {
            Description: makeLocalizationArray(solution.descriptions)
          },
          Version: { "": solution.version },
          Managed: { "": bInt(solution.isManaged) },
          Publisher: {
            UniqueName: { "": publisher.uniqueName },
            LocalizedNames: {
              LocalizedName: makeLocalizationArray(publisher.displayNames)
            },
            Descriptions: {
              Description: makeLocalizationArray(publisher.descriptions)
            },
            EmailAddress: { "": publisher.email },
            SupportingWebsiteUrl: { "": publisher.website },
            CustomizationPrefix: { "": publisher.customizationPrefix },
            CustomizationOptionValuePrefix: { "": publisher.optionsetPrefix },
            Addresses: {
              Address: [makeAddressObject(1, publisher.address1), makeAddressObject(2, publisher.address2)]
            }
          },
          RootComponents: {
            RootComponent: solution.entities.map(e => { 
              return { type: 1, schemaName: e.schemaName };
            }).concat(solution.webResources.map(w => {
              return { type: 61, schemaName: w.schemaName };
            }))
          },
          MissingDependencies: {}
        }
      };

      // -- build out the Customizations object map
      const customizationMap = {
        Entities: {
          Entity: solution.entities.map(e => {
            return {
              Name: {
                "": e.uniqueName,
                LocalizedName: e.displayNames[solution.defaultLanguage],
                OriginalName: e.displayNames[solution.defaultLanguage]
              },
              ObjectTypeCode: { "": e.objectTypeCode },
              EntityInfo: {
                entity: {
                  Name: e.uniqueName,
                  LocalizedNames: {
                    LocalizedName: makeLocalizationArray(e.displayNames)
                  },
                  LocalizedCollectionNames: {
                    LocalizedCollectionName: makeLocalizationArray(e.displayPluralNames)
                  },
                  Descriptions: {
                    Description: makeLocalizationArray(e.descriptions)
                  },
                  attributes: {
                    attribute: e.attributes.map(a => {
                      let base = {
                        PhysicalName: a.schemaName,
                        Type: { "": a.type },
                        Name: { "": a.logicalName },
                        LogicalName: { "": a.logicalName },
                        RequiredLevel: { "": a.requiredLevel },
                        DisplayMask: { "": a.displayMask },
                        ImeMode: { "": a.imeMode },
                        ValidForReadApi: { "": a.validForReadApi },
                        IsCustomField: { "": bInt(a.isCustomField) },
                        IsAuditEnabled: { "": bInt(a.isAuditEnabled) },
                        IsSecured: { "": bInt(a.isSecured) },
                        IsCustomizable: { "": bInt(a.isCustomizable) },
                        IsRenameable: { "": bInt(a.isRenameable) },
                        CanModifySearchSettings: { "": bInt(a.canModifySearchSettings) },
                        CanModifyRequirementLevelSettings: { "": bInt(a.canModifyRequirementLevelSettings) },
                        CanModifyAdditionalSettings: { "": bInt(a.canModifyAdditionalSettings) }
                      };

                      switch(a.type) {
                        case "lookup":
                        break;

                        case "datetime":
                        break;

                        case "picklist":
                        break;

                        case "bit":
                        break;

                        case "nvarchar":
                        break;

                        case "primarykey":
                        break;

                        case "decimal":
                        break;
                      }

                      base["displaynames"] = {
                        displayname: makeLocalizationArray(a.displayNames)
                      };

                      base["Descriptions"] = {
                        Description: makeLocalizationArray(a.descriptions)
                      };

                      return base;
                    })
                  },
                  IsDuplicateCheckSupported: { "": bInt(e.isDuplicateCheckSupported) },
                  IsRequiredOffline: { "": bInt(e.isRequiredOffline) },
                  IsCollaboration: { "": bInt(e.isCollaboration) },
                  AutoRouteToOwnerQueue: { "": bInt(e.autoRouteToOwnerQueue) },
                  IsConnectionsEnabled: { "": bInt(e.isConnectionsEnabled) },          
                  IsDocumentManagementEnabled: { "": bInt(e.isDocumentManagementEnabled) },
                  OwnershipTypeMask: { "": e.ownershipTypeMask },
                  IsAuditEnabled: { "": bInt(e.isAuditEnabled) },
                  IsActivity: { "": bInt(e.isActivity) },
                  ActivityTypeMask: { "": e.activityTypeMask },
                  IsActivityParty: { "": bInt(e.isActivityParty) },
                  IsReplicated: { "": bInt(e.isReplicated) },
                  IsReplicationUserFiltered: { "": bInt(e.isReplicationUserFiltered) },
                  IsMailMergeEnabled: { "": bInt(e.isMailMergeEnabled) },
                  IsVisibleInMobile: { "": bInt(e.isVisibleInMobile) },
                  IsMapiGridEnabled: { "": bInt(e.isMapiGridEnabled) },
                  IsReadingPaneEnabled: { "": bInt(e.isReadingPaneEnabled) },
                  IsCustomizable: { "": bInt(e.isCustomizable) },
                  IsRenameable: { "": bInt(e.isRenameable) },
                  IsMappable: { "": bInt(e.isMappable) },
                  CanModifyAuditSettings: { "": bInt(e.canModifyAuditSettings) },
                  CanModifyMobileVisibility: { "": bInt(e.canModifyMobileVisibility) },
                  CanModifyConnectionSettings: { "": bInt(e.canModifyConnectionSettings) },
                  CanModifyDuplicateDetectionSettings: { "": bInt(e.canModifyDuplicateDetectionSettings) },
                  CanModifyMailMergeSettings: { "": bInt(e.canModifyMailMergeSettings) },
                  CanModifyQueueSettings: { "": bInt(e.canModifyQueueSettings) },
                  CanCreateAttributes: { "": bInt(e.canCreateAttributes) },
                  CanCreateForms: { "": bInt(e.canCreateForms) },
                  CanCreateCharts: { "": bInt(e.canCreateCharts) },
                  CanCreateViews: { "": bInt(e.canCreateViews) },
                  CanModifyAdditionalSettings: { "": bInt(e.canModifyAdditionalSettings) },
                  IconLargeName: { "": e.iconLarge },
                  IconMediumName: { "": e.iconMedium },
                  IconSmallName: { "": e.iconSmall }
                }
              },
              FormXml: {},
              SavedQueries: {},
              RibbonDiffXml: {}
            };
          })
        },
        Roles: {},
        Workflows: {},
        FieldSecurityProfiles: {},
        Templates: {},
        EntityMaps: {},
        EntityRelationships: {},
        OrganizationSettings: {},
        optionsets: {},
        WebResources: {},
        Languages: {
          Language: solution.languages
        }
      };

      const contentTypesMap = {};


      // -- set up files object
      let files = Object.freeze({
        solution: common.writeXml(solutionMap, 'ImportExportXml'),
        customizations: common.writeXml(customizationMap, 'ImportExportXml'),
        content_types: common.writeXml(contentTypesMap, 'Types', true),
        files: [].concat(
          solution.reports.map(rp => {
            return { content: rp.content, fileName: `Reports/${rp.schemaName.replace(' ', '').replace('.', '')}-${rp.id}` };
          }),
          solution.workflows.map(wf => {
            return { fileName: `Workflows/${wf.schemaName}-${wf.id}.xaml`, content: wf.content };
          }),
          solution.pluginAssemblies.map(pa => {
            return { fileName: `PluginAssemblies/${pa.schemaName}-${pa.id}/${pa.schemaName.replace('.', '')}.dll`, content: pa.content, isBinary: true };
          }),
          solution.webResources.map(wr => {
            return { fileName: `WebResources/${wr.schemaName}${wr.id}`, content: wr.content, isBinary: (wr.type === 'png' || wr.type === 'xap' || wr.type === 'jpg' || wr.type === 'gif' || wr.type === 'ico')};
          })
        )
      });

      resolve(files);
    }
    catch (e) {
      report(100, "Error encountered so exiting.");
      reject(e);
    }
  });
};

const unmake = (files) => {

};

/**
 * Registers a strategy object for the Dynamics CRM 2011 version.
 * 
 * @param {Function} Callback used to register the factory
 */
module.exports = function (register) {
  register("5.x", { make, unmake });
};