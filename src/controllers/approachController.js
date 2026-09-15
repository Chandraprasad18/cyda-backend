import Approach from "../models/approachModel.js";
import fs from "fs";
import path from "path";

// =====================================================
// GET ALL APPROACH DATA
// =====================================================

export const getApproachData = async (req, res) => {
  try {
    const data = await Approach.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("GET APPROACH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Approach data",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE APPROACH
// =====================================================

export const createApproachData = async (req, res) => {
  try {
    console.log("========== APPROACH CREATE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      subtitle,
      description,
    } = req.body;

    // Required validation
    if (!title || !subtitle || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subtitle and description are required",
      });
    }

    // Image path
    let imageUrl = "";

    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    // Create new record
    const newApproach = await Approach.create({
      title,
      subtitle,
      description,
      imageUrl,
    });

    console.log(
      "CREATED APPROACH:",
      newApproach
    );

    return res.status(201).json({
      success: true,
      message:
        "Approach created successfully",
      data: newApproach,
    });
  } catch (error) {
    console.error(
      "CREATE APPROACH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create Approach",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE APPROACH BY ID
// =====================================================

export const updateApproachData = async (
  req,
  res
) => {
  try {
    console.log(
      "========== APPROACH UPDATE =========="
    );

    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { id } = req.params;

    const {
      title,
      subtitle,
      description,
    } = req.body;

    // Find record
    const existingData =
      await Approach.findById(id);

    if (!existingData) {
      return res.status(404).json({
        success: false,
        message:
          "Approach record not found",
      });
    }

    // =================================================
    // UPDATE TEXT
    // =================================================

    if (title !== undefined) {
      existingData.title = title;
    }

    if (subtitle !== undefined) {
      existingData.subtitle = subtitle;
    }

    if (description !== undefined) {
      existingData.description =
        description;
    }

    // =================================================
    // UPDATE IMAGE
    // =================================================

    if (req.file) {
      // Delete old image
      if (existingData.imageUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          existingData.imageUrl
        );

        console.log(
          "OLD IMAGE PATH:",
          oldImagePath
        );

        if (
          fs.existsSync(oldImagePath)
        ) {
          try {
            fs.unlinkSync(
              oldImagePath
            );

            console.log(
              "Old image deleted"
            );
          } catch (deleteError) {
            console.error(
              "OLD IMAGE DELETE ERROR:",
              deleteError
            );
          }
        }
      }

      // Save new image path
      existingData.imageUrl =
        `uploads/${req.file.filename}`;

      console.log(
        "NEW IMAGE:",
        existingData.imageUrl
      );
    }

    // =================================================
    // SAVE
    // =================================================

    const updatedData =
      await existingData.save();

    console.log(
      "UPDATED DATA:",
      updatedData
    );

    return res.status(200).json({
      success: true,
      message:
        "Approach updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error(
      "UPDATE APPROACH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update Approach",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE APPROACH BY ID
// =====================================================

export const deleteApproachData = async (
  req,
  res
) => {
  try {
    console.log(
      "========== APPROACH DELETE =========="
    );

    const { id } = req.params;

    console.log(
      "DELETE ID:",
      id
    );

    // Find record
    const existingData =
      await Approach.findById(id);

    if (!existingData) {
      return res.status(404).json({
        success: false,
        message:
          "Approach record not found",
      });
    }

    // =================================================
    // DELETE IMAGE FROM UPLOADS
    // =================================================

    if (existingData.imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        existingData.imageUrl
      );

      console.log(
        "DELETE IMAGE PATH:",
        imagePath
      );

      if (
        fs.existsSync(imagePath)
      ) {
        try {
          fs.unlinkSync(
            imagePath
          );

          console.log(
            "Image deleted successfully"
          );
        } catch (deleteError) {
          console.error(
            "IMAGE DELETE ERROR:",
            deleteError
          );
        }
      }
    }

    // =================================================
    // DELETE DATABASE RECORD
    // =================================================

    await Approach.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Approach deleted successfully",
      data: {
        id: id,
      },
    });
  } catch (error) {
    console.error(
      "DELETE APPROACH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete Approach",
      error: error.message,
    });
  }
};