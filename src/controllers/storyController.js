import Story from '../models/Story.js';
import fs from 'fs';
import path from 'path';

// Helper function to delete local image file
const deleteLocalImage = (imagePath) => {
  if (!imagePath) return;
  try {
    const filename = path.basename(imagePath);
    const localFilePath = path.join('public/uploads', filename);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Deleted image from disk: ${localFilePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file from disk: ${error.message}`);
  }
};

// @desc    Get all success stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ createdAt: -1 });
    return res.json(stories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a success story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req, res) => {
  const { studentName, college, course, package: jobPackage, year, testimonial } = req.body;

  if (!studentName || !college || !course || !jobPackage || !year || !testimonial) {
    if (req.file) {
      deleteLocalImage(req.file.filename);
    }
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const story = await Story.create({
      studentName,
      college,
      course,
      package: jobPackage,
      year,
      testimonial,
      image: imageUrl
    });

    return res.status(201).json(story);
  } catch (error) {
    if (req.file) deleteLocalImage(req.file.filename);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a success story
// @route   PUT /api/stories/:id
// @access  Private
export const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      if (req.file) deleteLocalImage(req.file.filename);
      return res.status(404).json({ message: 'Success story not found' });
    }

    const { studentName, college, course, package: jobPackage, year, testimonial } = req.body;

    story.studentName = studentName || story.studentName;
    story.college = college || story.college;
    story.course = course || story.course;
    story.package = jobPackage || story.package;
    story.year = year || story.year;
    story.testimonial = testimonial || story.testimonial;

    if (req.file) {
      if (story.image) {
        deleteLocalImage(story.image);
      }
      story.image = `/uploads/${req.file.filename}`;
    }

    const updatedStory = await story.save();
    return res.json(updatedStory);
  } catch (error) {
    if (req.file) deleteLocalImage(req.file.filename);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a success story
// @route   DELETE /api/stories/:id
// @access  Private
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (story) {
      if (story.image) {
        deleteLocalImage(story.image);
      }
      await story.deleteOne();
      return res.json({ message: 'Success story removed successfully' });
    } else {
      return res.status(404).json({ message: 'Success story not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Seed function
export const seedSuccessStories = async () => {
  try {
    const count = await Story.countDocuments();
    if (count === 0) {
      const defaultStories = [
        {
          studentName: "Kunal Mehta",
          college: "Top College",
          course: "B.Tech Aspirant",
          package: "12 LPA",
          year: "2025",
          testimonial: "I had no idea how to begin my B.Tech admission. Their team supported me with documents, comparison, and application submission.",
          image: ""
        },
        {
          studentName: "Ananya Verma",
          college: "Management Institute",
          course: "MBA Student",
          package: "15 LPA",
          year: "2025",
          testimonial: "The counselling sessions were clear and very helpful. They explained fees, placements, and specialisations in detail. I'm now pursuing my MBA.",
          image: ""
        },
        {
          studentName: "Rahul Sharma",
          college: "RVCE Bangalore",
          course: "Engineering Student",
          package: "18 LPA",
          year: "2025",
          testimonial: "SS Education made my RVCE admission journey incredibly smooth. From selecting the branch to paperwork, they were with me at every step.",
          image: ""
        },
        {
          studentName: "Priya Das",
          college: "Medical College",
          course: "Medical Aspirant",
          package: "Admitted",
          year: "2025",
          testimonial: "I was so confused about NEET counseling, but the team here explained everything so simply. I'm finally in my dream medical college!",
          image: ""
        },
        {
          studentName: "Vikram Singh",
          college: "Engineering College",
          course: "B.Tech Student",
          package: "8 LPA",
          year: "2024",
          testimonial: "The direct admission support was a lifesaver. No hidden fees, no stress. Just genuine help when I needed it most. Highly recommended!",
          image: ""
        },
        {
          studentName: "Sanya Malhotra",
          college: "MBA Aspirant",
          course: "MBA Student",
          package: "10 LPA",
          year: "2025",
          testimonial: "Best consultancy for MBA. They helped me with CAT score analysis and suggested colleges that I actually had a chance with.",
          image: ""
        },
        {
          studentName: "Arjun Reddy",
          college: "Engineering Student",
          course: "B.Tech Student",
          package: "14 LPA",
          year: "2025",
          testimonial: "Their network of colleges is huge. I got options I hadn't even heard of, and one turned out to be the perfect fit for my budget.",
          image: ""
        }
      ];
      await Story.insertMany(defaultStories);
      console.log('Seeded database with default Success Stories!');
    }
  } catch (error) {
    console.error('Error seeding success stories:', error.message);
  }
};
