import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getEndPointForDoctype } from './functions.js';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};
const requestOptionsPUT = {
  method: "PUT",
  headers: myHeaders,
  redirect: "follow",
};
const requestOptionsPOST = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow",
};

const url = getEndPointForDoctype('Perm');
const currentPath = process.cwd();
const customRoleFolder = path.join(currentPath, '..', 'customRole');
const filesListPath = path.join(currentPath, 'customRole.txt');

async function syncPermissions(rolesData) {
  for (const roleData of rolesData) {
    const { role, parent } = roleData;
    // Check if the role and parent already exist in the system
    let response = await fetch(`${url}?filters={"role":"${role}", "parent":"${parent}"}&fields=["*"]&limit_page_length=0`, requestOptions);
    let existingRecords = await response.json();
    
    if (existingRecords.data.length > 0) {
      
      const existingRecord = existingRecords.data[0];     
      const permissionsMatch = comparePermissions(existingRecord, roleData);

      if (!permissionsMatch) {
        const { name, ...filterRoleData } = roleData;
        // Update permissions if they don't match
        await fetch(`${url}/${existingRecord.name}`, {
          ...requestOptionsPUT,
          body: JSON.stringify(filterRoleData),
        });
        console.log(`Updated permissions for role ${role} document ${parent}`);
      } else {
        console.log(`Permissions already match for role ${role} document ${parent}`);
      }
    } else {
      // Create new role if not found
      await fetch(`${url}`, {
        ...requestOptionsPOST,
        body: JSON.stringify(roleData),
      });
      console.log(`Created new permission for document ${parent} for role ${role}`);
    }
  }
}

function comparePermissions(existing, incoming) {
  return (
    existing.if_owner === incoming.if_owner &&
    existing.permlevel === incoming.permlevel &&
    existing.select === incoming.select &&
    existing.read === incoming.read &&
    existing.write === incoming.write &&
    existing.create === incoming.create &&
    existing.delete === incoming.delete &&
    existing.submit === incoming.submit &&
    existing.cancel === incoming.cancel &&
    existing.amend === incoming.amend &&
    existing.report === incoming.report &&
    existing.export === incoming.export &&
    existing.import === incoming.import &&
    existing.set_user_permissions === incoming.set_user_permissions &&
    existing.share === incoming.share &&
    existing.print === incoming.print &&
    existing.email === incoming.email
  );
}

async function processCustomFieldFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    // Sync the permissions using the syncPermissions function
    await syncPermissions(jsonData);
    
    // console.log(`Successfully processed and synced data from: ${filePath}`);
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}

async function updateCustomFields() {
try {
  // Read the list of files to process from customRole.txt
  const filesToProcess = fs.readFileSync(filesListPath, 'utf8')
    .split('\n')
    .map(file => file.trim())
    .filter(Boolean);

  if (filesToProcess.length === 1 && filesToProcess[0] === 'Skip') {
    console.log('Role updating process is skipped as per the txt file.');
    return;
  }

  // If no files are listed in customRole.txt, process all JSON files in the customRole folder
  if (filesToProcess.length === 0) {
    console.log('No files specified in customRole.txt. Processing all JSON files in the customRole directory.');

    const allFiles = fs.readdirSync(customRoleFolder).filter(file => file.endsWith('.json'));
    for (const file of allFiles) {
      const filePath = path.join(customRoleFolder, file);
      console.log(`Processing JSON file: ${file}`);
      
      // Process each JSON file by reading and syncing permissions
      await processCustomFieldFile(filePath);
    }
  } else {
    // Process each file listed in customRole.txt
    for (const file of filesToProcess) {
      const filePath = path.join(customRoleFolder, file);

      // Check if the file exists before processing
      if (fs.existsSync(filePath)) {
        console.log(`Processing specified file: ${file}`);
        
        // Process each JSON file by reading and syncing permissions
        await processCustomFieldFile(filePath);
      } else {
        console.log(`File not found: ${file}`);
      }
    }
  }
} catch (err) {
  console.error('Error processing files:', err);
}
}
// Run the update function
updateCustomFields();