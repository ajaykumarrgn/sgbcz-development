/* eslint-disable */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getEndPointForDoctype } from './functions.js';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);

const requestOptions = {
  headers: myHeaders,
  redirect: "follow"
};

// Define paths
const current_path = process.cwd();
const userPermissionFolder = path.join(current_path, '..', 'userPermission');
const userPermissionFile = path.join(current_path, 'txt', 'userPermission.txt');
const baseUrl = getEndPointForDoctype('User Permission');

async function uploadUserPermissions() {
  try {
    // Step 1: Read the userPermission.txt file
    const userPermissionData = fs.readFileSync(userPermissionFile, 'utf8');

    // Step 2: Parse the key-value pairs
    const permissions = {};
    userPermissionData.split('\n').forEach(line => {
        line = line.trim(); // Trim whitespace from the line
        // Skip empty lines and lines that start with a comment character
        if (line && !line.startsWith('#')) {
          // Check if DELETE is specified
          const isDelete = line.endsWith('DELETE');
          const cleanedLine = isDelete ? line.replace('DELETE', '').trim() : line;

          // Use the cleaned line as the path
          const pathParts = cleanedLine.split('/').map(item => item.trim());
          if (pathParts.length >= 3) {
            const key = pathParts[0]; // e.g., "Territory"
            const forValue = pathParts[1]; // e.g., "Germany Selling"
            const userEmailFile = pathParts[2]; // e.g., "user1@sgb-smit.group.json"

            if (!permissions[key]) permissions[key] = [];
            permissions[key].push({ forValue, userEmailFile, isDelete }); // Store the delete flag
          } else {
            console.error(`Invalid path structure in userPermission.txt: ${line}`);
          }
        }
      });

    // Step 3: Iterate over each permission
    for (const [key, userEntries] of Object.entries(permissions)) {
      for (const { forValue, userEmailFile, isDelete } of userEntries) {
        const allowFolder = path.join(userPermissionFolder, key);
        const forValueFolder = path.join(allowFolder, forValue);
        const userFilePath = path.join(forValueFolder, userEmailFile);

        // Check if the user.json file exists
        if (fs.existsSync(userFilePath)) {
          const userData = fs.readFileSync(userFilePath, 'utf8');
          const jsonData = JSON.parse(userData);

          // Step 4: Perform GET request to check if the resource exists
          const getResponse = await fetch(`${baseUrl}?filters={"user":"${userEmailFile.replace('.json', '')}","allow":"${key}"}`, {
            ...requestOptions,
            method: 'GET'
          });

          const existingData = await getResponse.json();

          // Step 5: Perform DELETE or Update/Create based on isDelete flag
          if (isDelete) {
            // If DELETE is specified
            if (existingData.data && existingData.data.length > 0) {
              const name = existingData.data[0].name;
              const deleteUrl = `${baseUrl}/${name}`;
              
              // Perform DELETE request
              const deleteResponse = await fetch(deleteUrl, {
                ...requestOptions,
                method: 'DELETE'
              });

              if (deleteResponse.ok) {
                console.log(`Successfully deleted user permission for ${userEmailFile}`);
              } else {
                console.error(`Failed to delete user permission for ${userEmailFile}: ${deleteResponse.statusText}`);
              }
            } else {
              console.log(`No existing user permission found to delete for ${userEmailFile}`);
            }
          } else {
            // Regular processing: PUT or POST based on existence
            if (existingData.data && existingData.data.length > 0) {
              const name = existingData.data[0].name;
              const putUrl = `${baseUrl}/${name}`;
              
              const putResponse = await fetch(putUrl, {
                ...requestOptions,
                method: 'PUT',
                body: JSON.stringify(jsonData)
              });

              if (putResponse.ok) {
                console.log(`Successfully updated user permission for ${userEmailFile}`);
              } else {
                console.error(`Failed to update user permission for ${userEmailFile}: ${putResponse.statusText}`);
              }
            } else {
              console.log(`No existing user permission found for ${userEmailFile}. Attempting POST...`);
              const postResponse = await fetch(baseUrl, {
                ...requestOptions,
                method: 'POST',
                body: JSON.stringify(jsonData)
              });

              if (postResponse.ok) {
                console.log(`Successfully posted user permission for ${userEmailFile}`);
              } else {
                console.error(`Failed to post user permission for ${userEmailFile}: ${postResponse.statusText}`);
              }
            }
          }
        } else {
          console.error(`User file not found for ${userEmailFile} in ${forValueFolder}: ${userFilePath}`);
        }
      }
    }
  } catch (error) {
    console.error('Error during upload process:', error.message);
  }
}

// Run the upload function
uploadUserPermissions();