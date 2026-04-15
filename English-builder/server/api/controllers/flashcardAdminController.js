import Vocabulary from "../models/Vocabulary.js";
import FlashcardTopic from "../models/FlashcardTopic.js";
import cloudinary from "../../utils/cloundinary.js";
import User from "../models/User.js";


export const createFlashcardTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({  success: false,
    message: "Validation failed",
    errors: {
      name: "Topic name is required"
    } });
    }

    const topic = await FlashcardTopic.create({ name, description });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllFlashcardTopics = async (req, res) => {
  try {
    const topics = await FlashcardTopic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getFlashcardTopicById = async (req, res) => {
  try {
    const topic = await FlashcardTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: "Invalid topic ID" });
  }
};


export const updateFlashcardTopic = async (req, res) => {
  try {
    const topic = await FlashcardTopic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: "Invalid topic ID" });
  }
};


export const deleteFlashcardTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const topic = await FlashcardTopic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    
    await Vocabulary.deleteMany({ topic: topicId });

    
    await FlashcardTopic.findByIdAndDelete(topicId);

    res.json({
      message: "Topic and all related vocabularies deleted"
    });

  } catch (error) {
    res.status(400).json({ message: "Invalid topic ID" });
  }
};
// Vocabulary
// createVocabulary
export const createVocabulary = async (req, res) => {
  try {
    const { word, definition, example, level, usIpa, ukIpa, topic } = req.body;

    const errors = {};

    if (!word) errors.word = "Word is required";
    if (!definition) errors.definition = "Definition is required";
    if (!level) errors.level = "Level is required";
    if (!topic) errors.topic = "Topic is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // check topic exists
    const topicExists = await FlashcardTopic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({ message: "Flashcard topic not found" });
    }

    
    const pronunciation = {
      us: { ipa: usIpa || "" },
      uk: { ipa: ukIpa || "" }
    };

    let imageUrl = "";

    
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "flashcards" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      imageUrl = result.secure_url;
    }

    
    const vocabulary = await Vocabulary.create({
      word,
      definition,
      example,
      level,
      pronunciation,
      topic,
      imageUrl
    });

    const populated = await vocabulary.populate("topic", "name");

    return res.status(201).json(populated);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate data",
        errors: {
          word: "This word already exists in this topic"
        }
      });
    }

    res.status(400).json({ message: error.message });
  }
};


export const getAllVocabularies = async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find()
      .populate("topic", "name")
      .sort({ createdAt: -1 });

    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ success: false,
  message: "Internal server error"
});
  }
};


export const getVocabularyById = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id)
      .populate("topic", "name description");

    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(400).json({ message: "Invalid vocabulary ID" });
  }
};


export const getVocabularyByTopic = async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find({
      topic: req.params.topicId
    }).populate("topic", "name");

    res.json(vocabularies);
  } catch (error) {
    res.status(400).json({ message: "Invalid topic ID" });
  }
};


export const updateVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);

      
    const {
      word,
      definition,
      example,
      level,
      topic,
      usIpa,
      ukIpa
    } = req.body;

    const errors = {};

      if (word !== undefined && !word) errors.word = "Word cannot be empty";
      if (definition !== undefined && !definition) errors.definition = "Definition cannot be empty";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors
        });
      }


    let imageUrl = vocabulary.imageUrl;

    
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "flashcards" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      imageUrl = result.secure_url;
    }

    //  Update fields
    vocabulary.word = word || vocabulary.word;
    vocabulary.definition = definition || vocabulary.definition;
    vocabulary.example = example || vocabulary.example;
    vocabulary.level = level || vocabulary.level;
    vocabulary.topic = topic || vocabulary.topic;
    vocabulary.imageUrl = imageUrl;

    //  Update pronunciation đúng cách
    if (usIpa !== undefined || ukIpa !== undefined) {
      vocabulary.pronunciation = {
        us: { ipa: usIpa || "" },
        uk: { ipa: ukIpa || "" }
      };
    }

    await vocabulary.save();

    const populated = await vocabulary.populate("topic", "name");

    return res.json(populated);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    res.json({ message: "Vocabulary deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid vocabulary ID" });
  }
};