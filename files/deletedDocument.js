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
function ensuredeleteFolderExists() {
  const deletedFolderPath = path.join(current_path, '..', 'deletedDocument');
  if (!fs.existsSync(deletedFolderPath)) {
    fs.mkdirSync(deletedFolderPath, { recursive: true });
    console.log('Created "deletedDocument" folder.');
  }
}

// Ensure "clientScript" folder exists
ensuredeleteFolderExists();

// Read filters from the configuration file

const configContent = fs.readFileSync(path.join(current_path,'txt', 'deletedDocument.txt'), 'utf8');
const filtersLine = configContent.split('\n').find(line => line.startsWith('filters ='));
const filters = filtersLine ? filtersLine.match(/filters\s*=\s*(.*)/)?.[1]?.trim() || '' : ''; 
const filterQuery = filters ? `&filters=${filters}` : '';
console.log(filterQuery)
const baseUrl = getEndPointForDoctype("");
fetch(`${baseUrl}Deleted Document?fields=["*"]${filterQuery}&limit_page_length=0`, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(documentDetails => {
        const folderName = documentDetails.deleted_doctype;
        const folderPath = path.join(current_path,'..', 'deletedDocument', folderName);
        const metaFileName = path.join(folderPath, `${documentDetails.deleted_name}.json`);

        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating folder:', err);
          } else {
            console.log('Folder created successfully:', folderName);

            const metaData = { ...documentDetails }; 
            fs.writeFile(metaFileName, JSON.stringify(metaData), { flag: 'w' }, (err) => {
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