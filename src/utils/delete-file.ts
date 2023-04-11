import * as fs from "fs";
import checkIfFileExist from "./check-if-file-exist";

export const removeFile = async (filePath) => {
  const isFileExist = await checkIfFileExist(filePath);

  if (!isFileExist) {
    throw new Error("FS operation failed");
  } else {
    await fs.promises.unlink(filePath);
  }
};

export default removeFile;