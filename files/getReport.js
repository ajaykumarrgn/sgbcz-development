/* eslint-disable */
import { getEndPointForDoctype } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY)

const current_path = process.cwd();

// Function to create the "reports" folder if it doesn't exist
function ensureReportsFolderExists() {
  const reportsFolderPath = path.join(current_path,'..', 'reports');
  if (!fs.existsSync(reportsFolderPath)) {
    fs.mkdirSync(reportsFolderPath, { recursive: true });
    console.log('Created "reports" folder.');
  }
}

// Ensure "reports" folder exists
ensureReportsFolderExists();

const baseUrl = getEndPointForDoctype("Report");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`${baseUrl}?fields=["*"]&filters={\"is_standard\": \"No\", \"disabled\":0}&limit_page_length=0`, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(item => {
        const folderName = item.name;
        const folderPath = path.join(current_path,'..', 'reports', folderName); //configure folderPath
        const reportScriptContent = item.report_script;
        const javascriptContent = item.javascript;
        const queryContent = item.query;
        const reportScriptName = item.name;
        const javaScriptName = item.name;
        const queryName = item.name;
        const javaScriptFileName = path.join(folderPath, `${javaScriptName}.js`);
        const reportScriptFileName = path.join(folderPath, `${reportScriptName}.py`);
        const queryFileName = path.join(folderPath, `${queryName}.sql`);
        const metaFileName = path.join(folderPath, `${folderName}.meta`);

        if (reportScriptContent || javascriptContent || queryContent) {
          fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating folder:', err);
            } else {
              console.log('Folder created successfully:', folderName);

              if (reportScriptContent) {
                fs.writeFile(reportScriptFileName, reportScriptContent, { flag: 'w' }, (err) => {
                  if (err) {
                    console.error('Error writing report script file:', err);
                  } else {
                    console.log('Report script file created successfully:', reportScriptFileName);
                  }
                });
              } else {
                console.log('No report script content to write for:', folderName);
              }

              if (javascriptContent) {
                fs.writeFile(javaScriptFileName, javascriptContent, { flag: 'w' }, (err) => {
                  if (err) {
                    console.error('Error writing JavaScript file:', err);
                  } else {
                    console.log('JavaScript file created successfully:', javaScriptFileName);
                  }
                });
              } else {
                console.log('No JavaScript content to write for:', folderName);
              }

              if (queryContent) {
                fs.writeFile(queryFileName, queryContent, { flag: 'w' }, (err) => {
                  if (err) {
                    console.error('Error writing query file:', err);
                  } else {
                    console.log('Query file created successfully:', queryFileName);
                  }
                });
              } else {
                console.log('No query content to write for:', folderName);
              }

              // Adjusted metadata
              const metadata = { ...item };
              delete metadata.report_script;
              delete metadata.javascript;
              delete metadata.query;
              fs.writeFile(metaFileName, JSON.stringify(metadata), { flag: 'w' }, (err) => {
                if (err) {
                  console.error('Error writing meta file:', err);
                } else {
                  console.log('Meta file created successfully:', metaFileName);
                }
              });
            }
          });
        } else {
          console.log('No content to create folder for:', folderName);
        }
      });
    } else {
      console.error('Invalid or empty data received from the API.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));