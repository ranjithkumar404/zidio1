const Meeting = require("../models/Meeting");

exports.createMeeting = async (req, res) => {

  try {
    const { title, description, date, users } = req.body;


    if (!title || !description || !date || !users || users.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const meeting = new Meeting({ title, description, date, users });
    await meeting.save();

    res.status(201).json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
};

exports.getMeetings = async (req, res) => {
  try {
   
    
    const meetings = await Meeting.find().populate("users", "username");
   
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error });
  }
};
