/* eslint-disable */
import fs from 'fs';
import { getEndPointForDoctype } from './functions.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

const current_path = process.cwd();
// Create the userPermission directory if it doesn't exist
const userPermissionFolder = path.join(current_path, '..', 'userPermission');
if (!fs.existsSync(userPermissionFolder)) {
    fs.mkdirSync(userPermissionFolder);
}

// Fetch all custom fields from the API
const url = getEndPointForDoctype('User Permission');

// Function to fetch data from API and create or update files per User Permission Doctype
async function createUserPermissionFiles() {
  try {
    // Fetch all custom fields (no Doctype filtering)
    const response = await fetch(`${url}?fields=["*"]&&limit_page_length=0`, requestOptions);
    const data = await response.json();

    // Ensure the API response contains data
    if (!data.data || data.data.length === 0) {
      console.log("No custom fields found");
      return;
    }

    // Group custom fields by Doctype ('allow')
    const groupedByDoctype = data.data.reduce((acc, item) => {
      const doctype = item.allow; 
      const user = item.user; 
      const forValue = item.for_value; // Get for_value for folder structure

      // Group by doctype
      if (!acc[doctype]) {
        acc[doctype] = {}; 
      }
      // Initialize for_value if not present
      if (!acc[doctype][forValue]) {
        acc[doctype][forValue] = {}; 
      }
      
      // Remove specified keys and keep necessary fields
      const { name, modified, modified_by, owner, creation, ...filteredItem } = item; 
      filteredItem.user = user; // Include user in the filtered item for file writing
      
      // Use a unique identifier for the entry, e.g., the name or some unique property
      acc[doctype][forValue][user] = filteredItem; // Store as a key-value pair
      return acc;
    }, {});

    // Create or update a JSON file for each Doctype and user
    for (const doctype of Object.keys(groupedByDoctype)) {
      // Create a folder for the Doctype if it doesn't exist
      const doctypeFolder = path.join(userPermissionFolder, doctype);
      if (!fs.existsSync(doctypeFolder)) {
        fs.mkdirSync(doctypeFolder);
      }

      // Iterate over each for_value group
      for (const forValue of Object.keys(groupedByDoctype[doctype])) {
        const forValueFolder = path.join(doctypeFolder, forValue);
        if (!fs.existsSync(forValueFolder)) {
          fs.mkdirSync(forValueFolder);
        }

        // Create or update a JSON file for each user
        for (const user of Object.keys(groupedByDoctype[doctype][forValue])) {
          const filename = `${user}.json`; 
          const filePath = path.join(forValueFolder, filename);

          // Prepare the content as a JSON object
          const content = groupedByDoctype[doctype][forValue][user];

          // Write or update the file
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
          console.log(`Created/Updated file: ${filename} in ${forValueFolder}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching or updating files:', error);
  }
}

// Run the function
createUserPermissionFiles();