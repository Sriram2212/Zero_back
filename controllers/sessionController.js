const Session = require('../models/Session');
const Skill = require('../models/Skill');

// Book a session
exports.bookSession = async (req, res) => {
  try {
    const { skillId, date, timeSlot } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    const session = new Session({
      skill: skillId,
      tutor: skill.offeredBy,
      learner: req.user._id,
      date,
      timeSlot
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get sessions for current user (as tutor or learner)
exports.getMySessions = async (req, res) => {
    try {
      const sessions = await Session.find({
        $or: [
          { tutor: req.user._id },
          { learner: req.user._id }
        ]
      })
      .populate('skill')
      .populate('tutor', 'username _id')  // Include _id
      .populate('learner', 'username _id'); // Include _id
      
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update session status (tutor or learner)
exports.updateSessionStatus = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    // Only tutor or learner can update
    if (
      session.tutor.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    session.status = req.body.status;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
