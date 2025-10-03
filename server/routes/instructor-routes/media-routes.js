import express from "express";
import multer from "multer";
import { 
  uploadMediaToCloudinary, 
  deleteMediaFromCloudinary 
} from "../../helpers/cloudinary.js"; // note the .js extension in ESM

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Single upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

// Delete media
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// Bulk upload
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

export default router;
