/* eslint-disable */
import { getEndPointForDoctype } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);
myHeaders.append("Content-Type", "application/json"); // Set the content type

const current_path = process.cwd();
const customDoctypeFolderPath = path.join(current_path, '..', 'customDoctype');

// Function to upload a JSON file
async function uploadJsonFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    const baseUrl = getEndPointForDoctype("Custom Doctype");
    const requestUrl = `${baseUrl}/${jsonData.name}`; // Use the 'name' for the PUT request

    // First try PUT request
    const putResponse = await fetch(requestUrl, {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(jsonData), // Set the body to the JSON data
    });

    if (putResponse.ok) {
      console.log('Updated document:', jsonData.name);
    } else if (putResponse.status === 404) {
      console.log(`Document not found for ${jsonData.name}. Trying to create it with POST...`);

      // Attempt POST since PUT failed with 404
      const postResponse = await fetch(baseUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(jsonData), // Set the body to the JSON data
      });

      if (postResponse.ok) {
        console.log('Created document:', jsonData.name);
      } else {
        const errorMessage = await postResponse.text();
        console.error(`HTTP error on POST! Status: ${postResponse.status}, Message: ${errorMessage}`);
      }
    } else {
      // Log other error statuses for PUT
      const errorMessage = await putResponse.text();
      console.error(`HTTP error on PUT! Status: ${putResponse.status}, Message: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error during request:', error);
  }
}

// Function to process JSON files in the specified order
async function processJsonFiles(directory) {
  try {
    // Process the child directory: customChildDoctype
    const childDirectoryPath = path.join(directory, 'customChildDoctype');
    if (fs.existsSync(childDirectoryPath)) {
      const childFiles = fs.readdirSync(childDirectoryPath);
      for (const file of childFiles) {
        const filePath = path.join(childDirectoryPath, file);
        if (file.endsWith('.json') && fs.statSync(filePath).isFile()) {
          console.log(`Processing child file: ${filePath}`);
          await uploadJsonFile(filePath); // Upload child JSON files
        }
      }
    }

    // Next, process the single directory: customSingleDoctype
    const singleDirectoryPath = path.join(directory, 'customSingleDoctype');
    if (fs.existsSync(singleDirectoryPath)) {
      const singleFiles = fs.readdirSync(singleDirectoryPath);
      for (const file of singleFiles) {
        const filePath = path.join(singleDirectoryPath, file);
        if (file.endsWith('.json') && fs.statSync(filePath).isFile()) {
          console.log(`Processing single file: ${filePath}`);
          await uploadJsonFile(filePath); // Upload single JSON files
        }
      }
    }

    // Finally, process JSON files in the parent directory
    const parentDirectoryPath = path.join(directory, 'parent');
    if (fs.existsSync(parentDirectoryPath)) {
      const parentFiles = fs.readdirSync(parentDirectoryPath);
      for (const file of parentFiles) {
        const filePath = path.join(parentDirectoryPath, file);
        if (file.endsWith('.json') && fs.statSync(filePath).isFile()) {
          console.log(`Processing parent file: ${filePath}`);
          await uploadJsonFile(filePath); // Upload each JSON file
        }
      }
    }

  } catch (error) {
    console.error('Error processing JSON files:', error);
  }
}

// Start processing the JSON files
processJsonFiles(customDoctypeFolderPath).catch(console.error);
