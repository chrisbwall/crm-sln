

function zipSolutionFiles(files) {
    let addFilesToFolder = (files, folderName, zip) => {
    if (typeof files === "object" && files != null && Array.isArray(files) && files.length > 0) {
      let dir = zip.folder(folderName);
      files.forEach(f => {
        dir.file(f.fileName, f.content, f.options);
      });
    }
  };
  
  let zip = new JSZip();
      zip.file("[Content_Types].xml", files.contentTypes);
      zip.file("customizations.xml", files.customizations);
      zip.file("solution.xml", files.solution);

      report(65, "Writing Web Resources to ZIP archive...");
      addFilesToFolder(files.webResources, "WebResources", zip);

      report(75, "Writing Plugin Assemblies to ZIP archive...");
      addFilesToFolder(files.pluginAssemblies, "PluginAssemblies", zip);

      report(85, "Writing Workflows to ZIP archive...");
      addFilesToFolder(files.workflows, "Workflows", zip);

      report(95, "Writing Reports to ZIP archive...");
      addFilesToFolder(files.reports, "Reports", zip);

      report(100, "Finalizing the ZIP archive...");
}