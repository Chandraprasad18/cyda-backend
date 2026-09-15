import DevelopmentProgram from "../models/NewProgramModel.js";

// GET all programs
export const getPrograms = async (req, res) => {
  try {
    const programs = await DevelopmentProgram.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single program by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await DevelopmentProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET program by Category
export const getProgramByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const formattedCategory = categoryName.toLowerCase().trim();
    
    const program = await DevelopmentProgram.findOne({ 
      category: formattedCategory 
    });
    
    if (!program) {
      return res.status(200).json({ 
        success: true, 
        data: {
          category: formattedCategory,
          intro: "",
          imageContentArray: []
        },
        message: "Program data not found for this category, returning empty structure" 
      });
    }
    
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE or UPDATE program by Category (Supports both JSON payload and Multipart FormData)
export const createProgram = async (req, res) => {
  try {
    // ଯଦି ସିଧାସଳଖ imageContentArray ପଠାଯାଏ (ଯେପରିକି ଡିଲିଟ୍ ବା ବଲ୍କ ଅପଡେଟ୍ ସମୟରେ)
    if (req.body.imageContentArray && !req.body.title && !req.body.name && !req.file) {
      const { category, intro, imageContentArray } = req.body;
      if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
      }
      const formattedCategory = category.toLowerCase().trim();
      const updatedProgram = await DevelopmentProgram.findOneAndUpdate(
        { category: formattedCategory },
        { intro, imageContentArray: imageContentArray || [] },
        { new: true, upsert: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: updatedProgram });
    }

    let category, intro, imageContentArray;

    if (req.file || req.body.title || req.body.name || req.isFormData) {
      category = req.body.category;
      intro = req.body.intro;

      if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
      }

      const formattedCategory = category.toLowerCase().trim();

      let imagePath = req.body.existingImage || '';
      if (req.file) {
        imagePath = `uploads/${req.file.filename}`;
      }

      const newCard = {
        title: req.body.title || '',
        name: req.body.name || '',
        categoryWiseData: {
          image: imagePath,
          firstHead: req.body.firstHead || '',
          boldParaContent: req.body.boldParaContent || '',
          normalParagraph: req.body.normalParagraph || ''
        }
      };

      let existingProgram = await DevelopmentProgram.findOne({ category: formattedCategory });

      if (existingProgram) {
        imageContentArray = existingProgram.imageContentArray || [];
        
        const existingIndex = imageContentArray.findIndex(item => item.name === newCard.name);
        if (existingIndex !== -1) {
          if (!req.file && !imagePath) {
            newCard.categoryWiseData.image = imageContentArray[existingIndex].categoryWiseData?.image || '';
          }
          imageContentArray[existingIndex] = newCard;
        } else {
          imageContentArray.push(newCard);
        }

        existingProgram.intro = intro !== undefined ? intro : existingProgram.intro;
        existingProgram.imageContentArray = imageContentArray;
        await existingProgram.save();

        return res.status(200).json({ success: true, data: existingProgram });
      } else {
        const createdProgram = await DevelopmentProgram.create({
          category: formattedCategory,
          intro: intro || '',
          imageContentArray: [newCard]
        });
        return res.status(200).json({ success: true, data: createdProgram });
      }

    } else {
      const { category, intro, imageContentArray } = req.body;
      if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
      }

      const formattedCategory = category.toLowerCase().trim();

      const updatedProgram = await DevelopmentProgram.findOneAndUpdate(
        { category: formattedCategory },
        { intro, imageContentArray: imageContentArray || [] },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(200).json({ success: true, data: updatedProgram });
    }

  } catch (error) {
    console.error("Error in createProgram/Upsert:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update program by ID
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Program ID is required" });
    }

    let updateData = req.body;
    if (req.file) {
      updateData.coverImage = `uploads/${req.file.filename}`;
    }

    const updatedProgram = await DevelopmentProgram.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ success: false, message: "Program not found in database" });
    }

    res.status(200).json({ success: true, data: updatedProgram });
  } catch (error) {
    console.error("Database Update Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE program item or entire document
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, itemId } = req.query; 

    if (category && itemId) {
      const updatedProgram = await DevelopmentProgram.findOneAndUpdate(
        { category: category.toLowerCase().trim() },
        { $pull: { imageContentArray: { _id: itemId } } },
        { new: true }
      );

      if (!updatedProgram) {
        return res.status(404).json({ success: false, message: "Category or Item not found" });
      }

      return res.status(200).json({ success: true, message: "Card deleted successfully", data: updatedProgram });
    }

    const deletedProgram = await DevelopmentProgram.findByIdAndDelete(id);
    if (!deletedProgram) return res.status(404).json({ success: false, message: "Program not found" });
    
    res.json({ success: true, message: "Program deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};