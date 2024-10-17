import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export const uploadSingleImages = async (ID, image, index) => {
    try {
        // Create a reference to the storage location
        const storageRef = ref(storage, `images/${ID}/${index}`);

        // Upload the image file to Firebase Storage
        await uploadBytes(storageRef, image);

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        return { success: true, downloadURL };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, error: error.message };
    }
};
