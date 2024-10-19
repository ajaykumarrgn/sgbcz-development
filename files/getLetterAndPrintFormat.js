/* eslint-disable */
import { getEndPointForDoctype, doctypeConfigs } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
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

function ensureFolderExists(folderName) {
  const folderPath = path.join(current_path, '..', folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created "${folderName}" folder.`);
  }
}

function fetchAndSaveDocuments(doctype) {
  const { filters, folder, subfolder } = doctypeConfigs[doctype];
  ensureFolderExists(folder);

  const baseUrl = getEndPointForDoctype(doctype);
  fetch(`${baseUrl}?fields=["*"]&filters=${filters}&limit_page_length=0`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.data && Array.isArray(data.data)) {
        data.data.forEach(documentDetails => {
          const folderName = documentDetails.doc_type;
          const folderPath = subfolder ? path.join(current_path, '..', folder, folderName) : path.join(current_path, '..', folder)
          const metaFileName = path.join(folderPath, `${documentDetails.name}.meta`);
          const metaData = { ...documentDetails };
          if (subfolder) {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
              if (err) {
                console.error('Error creating folder:', err);
              } else {
                console.log('Folder created successfully:', folderName);
    
            fs.writeFile(metaFileName, JSON.stringify(metaData), { flag: 'w' }, (err) => {
              if (err) {
                console.error(`Error writing ${doctype} file:`, err);
              } else {
                console.log(`${doctype} file created successfully:`, metaFileName);
              }
            });
          }
          });
          } else {
            fs.writeFile(metaFileName, JSON.stringify(metaData), { flag: 'w' }, (err) => {
              if (err) {
                console.error(`Error writing ${doctype} file:`, err);
              } else {
                console.log(`${doctype} file created successfully:`, metaFileName);
              }
            });
          }
        });
      } else {
        console.error('Invalid or empty data received from the API.');
      }
    })
    .catch(error => console.error(`Error fetching data for ${doctype}:`, error));
}

// Loop through the doctypeConfigs and call fetchAndSaveDocuments for each
Object.keys(doctypeConfigs).forEach(doctype => {
  fetchAndSaveDocuments(doctype);
});