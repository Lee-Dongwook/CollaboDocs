import { Router } from "express";
import DocumentModel from "../models/document.model";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newDocument = new DocumentModel({ title, content });
    await newDocument.save();
  } catch (error) {
    res.status(500).json({ message: "Failed to create document", error });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const document = await DocumentModel.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to get document", error });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { content } = req.body;
  try {
    const document = await DocumentModel.findByIdAndUpdate(
      req.params.id,
      { content, $push: { versions: { content } } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to update document", error });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const document = await DocumentModel.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete document", error });
  }
});

router.get("/:id/versions", verifyToken, async (req, res) => {
  try {
    const document = await DocumentModel.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document.versions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch versions", error });
  }
});

router.put("/:id/restore", verifyToken, async (req, res) => {
  const { versionIndex } = req.body;

  try {
    const document = await DocumentModel.findByIdAndUpdate(req.params.id);
    if (
      !document ||
      versionIndex < 0 ||
      versionIndex >= document.versions.length
    ) {
      return res.status(400).json({ message: "Invalid version index" });
    }

    document.content = document.versions[versionIndex].content;
    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to restore version:", error });
  }
});

export default router;
