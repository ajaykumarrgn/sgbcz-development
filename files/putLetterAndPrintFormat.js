/* eslint-disable */
import { getEndPointForDoctype, doctypeConfigs } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '../.env' });

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY);
myHeaders.append('Content-Type', 'application/json');

function isFileChanged(filePath) {
  try {
    const gitStatus = execSync(`git status --porcelain "${filePath}"`, { encoding: 'utf-8' }).trim();
    return gitStatus !== '';
  } catch (error) {
    console.error(`Error checking Git status for file ${filePath}: ${error}`);
    return false;
  }
}

function isFileNew(filePath) {
  try {
    const isUncommitted = !execSync(`git log --format=%H -- "${filePath}"`, { encoding: 'utf-8' }).trim();
    return isUncommitted;
  } catch (error) {
    console.error(`Error checking Git status for file ${filePath}: ${error}`);
    return false;
  }
}



function createNewResource(baseUrl, requestBody) {
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: 'follow',
    };
    const url = baseUrl;
    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
            if (response.status === 409) {
                console.log(`Report creation conflict .... Skipping creation...`);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            } else {
            console.log(`New script created`);
            // Mark the report as created
            }
        }) 
        .catch(error => {
            console.error(`Error creating new script : ${error}`);
        });
  }
  

function processFilesInFolder(folderPath, doctype) {
  const { subfolder } = doctypeConfigs[doctype];
  const baseUrl = getEndPointForDoctype(doctype);
  
  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const currentFolder = path.join(folderPath, file);
        processFilesInFolder(currentFolder, doctype);
      } else {
        if (file.endsWith('.meta')) {
          let fileContent = fs.readFileSync(filePath, 'utf-8');
          
          try {
            fileContent = JSON.parse(fileContent);
            delete fileContent.name;
            delete fileContent.owner;
            delete fileContent.modified;
            delete fileContent.modified_by;
            delete fileContent.creation;
          } catch (error) {
            console.error(`Error parsing file ${filePath}: ${error}`);
            continue;
          }
          
          const postFilename = file.replace(/\.meta$/, '');
          const encodedFilename = encodeURIComponent(postFilename);
          const url = `${baseUrl}/${encodedFilename}`;

          if (isFileNew(filePath) || isFileChanged(filePath)) {
            const requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: JSON.stringify({ filename: postFilename, ...fileContent }),
              redirect: 'follow',
            };

            fetch(url, requestOptions)
              .then(response => {
                if (!response.ok) {
                  if (response.status === 404) {
                    createNewResource(baseUrl,
                        {  
                            name: postFilename,
                            ...fileContent, 
                             disabled: 0
                         });
                  } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                }
                return response.json();
              })
              .then(result => {
                console.log(`Processed file: ${file}`);
              })
              .catch(error => {
                console.error(`Error processing file ${file}:`, error);
              });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading folder ${folderPath}: ${error}`);
  }
}

// Start processing folders for each doctypes
Object.keys(doctypeConfigs).forEach(doctype => {
  const baseFolder = path.join('..', doctypeConfigs[doctype].folder);
  processFilesInFolder(baseFolder, doctype);
});