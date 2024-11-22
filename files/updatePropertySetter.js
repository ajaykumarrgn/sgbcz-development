/* eslint-disable */
import fs from 'fs';
import { getEndPointForDoctype } from './functions.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);
myHeaders.append("Content-Type", "application/json");

const requestOptionsPUT = {
  method: "PUT",
  headers: myHeaders,
  redirect: "follow"
};

const requestOptionsPOST = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

const current_path = process.cwd();
const customFieldFolder = path.join(current_path, '..', 'propertySetter');
const filesListPath = path.join(current_path, 'txt', 'propertySetter.txt'); // Path to the files list

const url = getEndPointForDoctype('');

async function updatePropertySetter() {
  try {
    const filesToProcess = fs.readFileSync(filesListPath, 'utf8')
      .split('\n')
      .map(file => file.trim())
      .filter(line => line && !line.startsWith('#'));

    if (filesToProcess.length === 1 && filesToProcess[0] === 'Skip') {
      console.log('Property Setter updating process is skipped as per the txt file.');
      return;
    }

    if (filesToProcess.length === 0) {
      console.log('No files specified in propertySetter.txt. Processing all JSON files in the customField directory.');
      processAllJSONFiles(customFieldFolder);
    } else {
      for (const relativePath of filesToProcess) {
        const filePath = path.join(customFieldFolder, relativePath);
        if (fs.existsSync(filePath)) {
          await processPropertySetterFile(filePath);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading or updating custom fields:', error);
  }
}

async function processAllJSONFiles(folderPath) {
  const allFiles = listJSONFiles(folderPath);
  for (const filePath of allFiles) {
    await processPropertySetterFile(filePath);
  }
}

function listJSONFiles(folderPath) {
  let fileList = [];
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(folderPath, item.name);
    if (item.isDirectory()) {
      fileList = fileList.concat(listJSONFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.json')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function processPropertySetterFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
    
        if (!fileContent.trim()) {
        console.error(`File ${filePath} is empty. Skipping.`);
        return;
        }
    
        const parsedContent = JSON.parse(fileContent);
    
        // Check if the parsed content is an array or a single object
        const customFields = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
        for (const field of customFields) {
        await updateSetter(field);
        }
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

async function updateSetter(field) {
  const customFieldName = field.name;
  const fieldUrl = `${url}Property Setter/${customFieldName}`;

  try {
    console.log(`Updating Property Setter: ${customFieldName}`);
    const response = await fetch(fieldUrl, {
      ...requestOptionsPUT,
      body: JSON.stringify(field)
    });

    if (response.ok) {
      console.log(`Successfully updated property Setter: ${customFieldName}`);
    } else if (response.status === 404) {
      console.warn(`Property Setter not found for update: ${customFieldName}. Attempting to create it via POST.`);
      await createPropertySetter(field);
    } else {
      console.error(`Failed to update property Setter: ${customFieldName}`, await response.text());
    }
  } catch (error) {
    console.error(`Error updating property setter: ${customFieldName}`, error);
  }
}

async function createPropertySetter(field) {
   
  try {
    const response = await fetch(`${url}Property Setter`, {
      ...requestOptionsPOST,
      body: JSON.stringify(field)
    });
    if (response.ok) {
      console.log(`Successfully created Property Setter: ${field.name}`);
    } else {
      console.error(`Failed to create Property Setter: ${field.name}`, await response.text());
    }
  } catch (error) {
    console.error(`Error creating property setter: ${field.name}`, error);
  }
}

updatePropertySetter();
