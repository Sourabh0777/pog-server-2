import fs from 'fs/promises';

// From the filePath get all the data from the file into a variable
export const getDataFromFile = async (filePath: string) => {
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const dataObject = JSON.parse(fileData);
    return dataObject;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
};
