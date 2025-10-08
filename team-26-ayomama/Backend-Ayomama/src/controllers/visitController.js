import Visit from "../models/Visit.js";

const visitSchedule = async (req, res) => {
  try {
    const { visitDate, visitTime, duration, hospitalName, doctorName } =
      req.body;

    const reminderDateTime = new Date(`${visitDate}T${visitTime}`);

    const userId = req.user._id;

    if (!visitDate || !visitTime) {
      res.status(400).json({ error: "Visit Date and Time are required" });
    }

    const visit = await Visit.create({
      user: userId,
      reminderDateTime,
      duration,
      hospitalName,
      doctorName,
    });
    res.status(200).json({ message: "Visit Successfully Scheduled", visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVisits = async (req, res) => {
  try {
    const userId = req.user._id;
    const visits = await Visit.find({ user: userId });
    res.status(200).json({ visits });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getVisitById = async (req, res) => {
  try {
    const Id = req.params.id;
    const userId = req.user._id;

    const visit = await Visit.findOne({ _id: Id, user: userId });

    if (!visit) {
      res.status(401).json({ error: "Visit not found" });
    }
    res.status(200).json({ visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSpecificVisit = async (req, res) => {
  try {
    const Id = req.params.id;
    const userId = req.user._id;
    const { visitDate, visitTime, duration, hospitalName, doctorName } =
      req.body;
    const reminderDateTime = new Date(`${visitDate}T${visitTime}`);

    const visit = await Visit.findOneAndUpdate(
      { _id: Id, user: userId },
      { reminderDateTime, duration, hospitalName, doctorName },
      { new: true, runValidators: true }
    );
    if (!visit) {
      res.status(404).json({ error: "Visit not found" });
    }
    res.status(200).json({ visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteVisit = async (req, res) => {
  try {
    const Id = req.params;
    const userId = req.user._id;

    const visit = await Visit.findOneAndDelete({ _Id: Id, user: userId });
    if (!visit) {
      res.status(404).json({ error: "No visit scheduled" });
    }
    res.status(200).json({ message: "Deleted Visit Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  visitSchedule,
  getVisits,
  getVisitById,
  updateSpecificVisit,
  deleteVisit,
};
