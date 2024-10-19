/* eslint-disable */
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

export const doctypeConfigs = {
  "Letter Head": {
    filters: "{\"disabled\":0}",
    folder: "letterHead",
    subfolder: false
  },
  "Print Format": {
    filters: "{\"standard\": \"No\",\"disabled\":0}",
    folder: "printFormat",
    subfolder: true
  }
};

export function getEndPointForDoctype(doctype){
  const current_path = process.cwd()
  const host = process.env.HOST
  const protocol = process.env.PROTOCOL

  var endpoint
  switch(doctype){
    case 'Client Script':
      endpoint = process.env.CLIENT_SCRIPT_END_POINT
      break
    case 'Server Script':
      endpoint = process.env.SERVER_SCRIPT_END_POINT
      break
    case 'Report':
      endpoint = process.env.REPORT_END_POINT
      break
    case 'Custom Field':
      endpoint = process.env.CUSTOM_FIELD_END_POINT
      break
    case 'Letter Head':
      endpoint = process.env.LETTER_HEAD_END_POINT
      break
    case 'Print Format':
      endpoint = process.env.PRINT_FORMAT_END_POINT
      break
    case 'Perm':
      endpoint = process.env.PERM_END_POINT
      break
    default:
      break

  }
  

  const baseUrl = `${protocol}://${host}/api/resource/${endpoint}`
  return baseUrl
  console.log("baseUrl", baseUrl)
}

