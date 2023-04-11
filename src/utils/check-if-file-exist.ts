import * as fs from "fs";

export const checkIfFileExist = async (filename) => {
  return await fs.promises
    .access(filename, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

export default checkIfFileExist;
