import axios from "axios";
import { UploadedFile } from "express-fileupload";
import { nowInSwedenISO } from "../utils/time";

const NEXTCLOUD_BASE_URL = process.env.NEXTCLOUD_BASE_URL!;
const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USERNAME!;
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD!;
const TARGET_FOLDER = "TBD-folder";

export const uploadToNextcloud = async (
  file: UploadedFile
): Promise<string> => {
  const filename = `${nowInSwedenISO}-${file.name}`;
  const targetPath = `${TARGET_FOLDER}/${nowInSwedenISO}-${file.name}`;
  const url = `${NEXTCLOUD_BASE_URL}${targetPath}`;

  // MOCK-mode active
  if (process.env.NEXTCLOUD_MOCK === "true") {
    console.log("Nextcloud is in MOCK mode");
    return `https://mock.nexcloud.local/${targetPath}`;
  }

  try {
    const res = await axios.put(url, file.data, {
      auth: {
        username: NEXTCLOUD_USERNAME,
        password: NEXTCLOUD_PASSWORD,
      },
      headers: {
        "Content-Type": file.mimetype,
      },
    });

    if (res.status === 201 || res.status === 204) {
      return url;
    } else {
      throw new Error(`Upload failed with status: ${res.status}`);
    }
  } catch (err) {
    console.error("Nextcloud upload error: ", err);
    throw err;
  }
};
