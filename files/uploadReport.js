/* eslint-disable */
import { getEndPointForDoctype } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({path: '../.env'});

const baseFolder = '../reports';

const myHeaders = {
  'Content-Type': 'application/json',
  'Authorization': process.env.KEY,
};

const baseUrl = getEndPointForDoctype("Report");

const createdReports = new Set();
const errorFile = new Set();

function readContent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.length > 0 ? content : null;
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
  return null;
}

function createNewReport(folderPath, jsContent, pyContent, sqlContent, metaContent) {
  const folderName = path.basename(folderPath);

  if (!createdReports.has(folderName)) {
    // Make a POST request to create a new report
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        report_name: folderName,
        report_script: pyContent,
        javascript: jsContent,
        query: sqlContent,
        ...metaContent,
      }),
      redirect: 'follow',
    };

    const url = baseUrl;

    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          if (response.status === 409) {
            console.log(`Report creation conflict for ${folderName}. Skipping creation...`);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } else {
          console.log(`New report created: ${folderName}`);
          createdReports.add(folderName); // Mark the report as created
        }
      })
      .catch(error => {
        console.error(`Error creating new report ${folderName}: ${error}`);
      });
  } else {
    console.log(`Report ${folderName} already created. Skipping creation...`);
  }
}

function processFilesInFolder(folderPath, baseFolder) {
  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      const fileExtension = path.extname(file).toLowerCase();
      const folderName = path.basename(folderPath); // Define folderName within the scope of the loop

      if (stats.isDirectory()) {
        processFilesInFolder(filePath, baseFolder);
      } else if (fileExtension !== '.meta' && !errorFile.has(file.replace(new RegExp(`\\${fileExtension}$`), ''))) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const encodedFilename = encodeURIComponent(file.replace(new RegExp(`\\${fileExtension}$`), ''));
        const metaFilePath = path.join(baseFolder, folderName, `${folderName}.meta`);
        let metaContent = fs.readFileSync(metaFilePath, 'utf-8');
                metaContent = JSON.parse(metaContent);
                delete metaContent.name;
                delete metaContent.owner;
                delete metaContent.modified;
                delete metaContent.modified_by;
                delete metaContent.roles;
                delete metaContent.creation;
                delete metaContent.columns;
                delete metaContent.roles;
                delete metaContent.filters;

        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify({
            filename: encodedFilename,
            [fileExtension === '.js' ? 'javascript' : (fileExtension === '.py' ? 'report_script' : 'query')]: fileContent,
            ...metaContent
          }),
          redirect: 'follow',
        };

        const url = `${baseUrl}/${encodedFilename}`;

        fetch(url, requestOptions)
          .then(response => {
            if (!response.ok) {
              if (response.status === 404) {
                // If the file doesn't exist, create a new report and retry the PUT request
                // const metaFilePath = path.join(baseFolder, folderName, `${folderName}.meta`);
                const jsFilePath = path.join(baseFolder, folderName, `${folderName}.js`);
                const pyFilePath = path.join(baseFolder, folderName, `${folderName}.py`);
                const sqlFilePath = path.join(baseFolder, folderName, `${folderName}.sql`);
                // let metaContent = fs.readFileSync(metaFilePath, 'utf-8');
                // metaContent = JSON.parse(metaContent);
                // delete metaContent.name;
                // delete metaContent.owner;
                // delete metaContent.modified;
                // delete metaContent.modified_by;
                // delete metaContent.roles;
                // delete metaContent.creation;
                // delete metaContent.columns;
                // delete metaContent.roles;
                // delete metaContent.filters;
                const jsContent = readContent(jsFilePath);
                const pyContent = readContent(pyFilePath);
                const sqlContent = readContent(sqlFilePath);

                createNewReport(folderPath, jsContent, pyContent, sqlContent, metaContent, folderName);
                errorFile.add(file.replace(new RegExp(`\\${fileExtension}$`), ''));
              } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            }
            return response.json();
          })
          .then(result => {
            console.log(`Processing file: ${file}`);
          })
          .catch(error => {
            console.error(`Error processing file ${file}: ${error}`);
          });
      }
    }
  } catch (error) {
    console.error(`Error reading folder ${folderPath}: ${error}`);
  }
}

// Start processing the base folder
processFilesInFolder(baseFolder, baseFolder);
