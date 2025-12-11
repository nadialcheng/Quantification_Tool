// SharePoint + Graph configuration.
// Replace placeholder values with your Azure AD / SharePoint details.
// NOTE: Do not commit production secrets or IDs you don't want public.
window.SHAREPOINT_CONFIG = {
  enabled: false, // flip to true after populating the values below
  clientId: 'YOUR-AZURE-AD-APP-CLIENT-ID',
  tenantId: 'YOUR-TENANT-ID-OR-DOMAIN',
  siteId: 'YOUR-SHAREPOINT-SITE-ID',
  driveId: 'YOUR-SHAREPOINT-DRIVE-ID', // usually the document library ID
  folderPath: '/Shared Documents/Venture Reports', // folder inside the drive
  scopes: ['Files.ReadWrite.All', 'Sites.ReadWrite.All'],
  notifyOnSuccess: true // set false to suppress success alerts
};
