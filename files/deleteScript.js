 
/* eslint-disable */
import { getEndPointForDoctype } from "./functions.js";
import dotenv from 'dotenv';
import fs from 'fs';
 
dotenv.config({ path: '../.env' });
 
fs.readFile('./txt/deleteRecord.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
 
  // Split the data by new lines and loop through each line
  const records = data.trim().split('\n'); // Splits the content by each line
 
  records.forEach((record) => {
    const baseUrl = getEndPointForDoctype(); // Get the base URL
 
    // Prepare the URL parameter (URL-encoded)
    const param = encodeURIComponent(record.trim());
    console.log(`Deleting record: ${param}`); // Log the record being deleted
 
    // Set up headers
    const myHeaders = new Headers();
    myHeaders.append("Authorization", process.env.KEY);
    myHeaders.append("Cookie", "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=");
 
    // Set up the request options
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
 
    // Perform the fetch request for each record
    fetch(`${baseUrl}${param}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // Check if the response is successful and print result
        if (result.message === "ok") {
          console.log(`${param} record is deleted successfully`);
        } else {
          console.log(`Failed to delete ${param}:`, result);
        }
      })
      .catch((error) => {
        console.error("Error during fetch for", param, error);
      });
  });
});
 