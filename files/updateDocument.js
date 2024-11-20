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
const customDoctypeFolderPath = path.join(current_path, '..', 'document');
 
// Function to upload a JSON file
async function uploadJsonFile(filePath, isSingleDocument, folderName = "") {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    const baseUrl = getEndPointForDoctype();
 
    // Determine the request URL based on whether it's a single document or a general document
    const requestUrl = isSingleDocument
      ? `${baseUrl}${jsonData.name}/${jsonData.name}` // Use this URL for single document
      : `${baseUrl}${encodeURIComponent(folderName)}/${jsonData.name}`; // Use this URL for general documents
 
    const postUrl = isSingleDocument
      ? `${baseUrl}${jsonData.name}/${jsonData.name}` // Use this URL for single document
      : `${baseUrl}${encodeURIComponent(folderName)}`; // Use this URL for general documents
 
    // First try PUT request
    const putResponse = await fetch(requestUrl, {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(jsonData), // Set the body to the JSON data
    });
 
    if (putResponse.ok) {
      console.log(`Updated document: ${jsonData.name}`);
    } else if (putResponse.status === 404) {
      console.log(`Document not found for ${jsonData.name}. Trying to create it with POST...`);
      // Attempt POST since PUT failed with 404
      
      const postResponse = await fetch(postUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(jsonData), // Set the body to the JSON data
      });
    
      if (postResponse.ok) {
        console.log(`Created document: ${jsonData.name}`);
      } else {
        const errorMessage = await postResponse.text();
        console.log(`HTTP error on POST! Status: ${postResponse.status}, Message: ${errorMessage}`);
      }
    } else {
      // Log other error statuses for PUT
      const errorMessage = await putResponse.text();
      console.log(`HTTP error on PUT! Status: ${putResponse.status}, Message: ${errorMessage}`);
    }
  } catch (error) {
    console.log(`Error during request: ${error.message}`);
  }
}
 
// Function to recursively process JSON files in the specified directory
async function processJsonFiles(directory, isSingleDocument = false, folderName = "") {
  try {
    // Read the contents of the directory
    const filesAndDirs = fs.readdirSync(directory);
 
    for (const entry of filesAndDirs) {
      const entryPath = path.join(directory, entry);
      const stat = fs.statSync(entryPath);
 
      if (stat.isDirectory()) {
        // Check if the current directory is 'singleDocument' to set the flag
        const isSingleDocFolder = entry === 'singleDocument';
 
        // Recursively process subdirectories, updating the isSingleDocument flag as needed
        await processJsonFiles(entryPath, isSingleDocFolder, entry);
      } else if (entry.endsWith('.json') && stat.isFile()) {
        console.log(`Processing JSON file: ${entryPath}`);
        await uploadJsonFile(entryPath, isSingleDocument, folderName); // Pass folderName for multiple document mode
      }
    }
  } catch (error) {
    console.log(`Error processing JSON files: ${error.message}`);
  }
}
 
// Start processing the JSON files
processJsonFiles(customDoctypeFolderPath).catch(console.error);