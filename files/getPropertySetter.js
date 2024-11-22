/* eslint-disable */
import { getEndPointForDoctype } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({path: '../.env'});

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY)

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

const current_path = process.cwd();

// Function to create the "clientScript" folder if it doesn't exist
function ensurePropertySetterFolderExists() {
  const propertySetterFolderPath = path.join(current_path, '..', 'propertySetter');
  if (!fs.existsSync(propertySetterFolderPath)) {
    fs.mkdirSync(propertySetterFolderPath, { recursive: true });
    console.log('Created "propertySetter" folder.');
  }
}

// Ensure "clientScript" folder exists
ensurePropertySetterFolderExists();

const baseUrl = getEndPointForDoctype("");

fetch(`${baseUrl}Property Setter?fields=["*"]&limit_page_length=0`, requestOptions)
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
        const folderPath = path.join(current_path,'..', 'propertySetter', folderName);
        const metaFileName = path.join(folderPath, `${documentDetails.name}.json`);

        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating folder:', err);
          } else {
            console.log('Folder created successfully:', folderName);

            const metaData = { ...documentDetails }; 
            delete metaData.owner; 
            delete metaData.creation; 
            delete metaData.modified; 
            delete metaData.modified_by; 
            fs.writeFile(metaFileName, JSON.stringify(metaData, null, 2), { flag: 'w' }, (err) => {
              if (err) {
                console.error('Error writing meta file:', err);
              } else {
                console.log('Meta file created successfully:', metaFileName);
              }
            }); 
          }
        });
      });
    } else {
      console.error('Invalid or empty data received from the API.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));