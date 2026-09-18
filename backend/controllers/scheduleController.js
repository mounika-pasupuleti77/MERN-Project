const Schedule = require('../models/Schedule');
const Appliance = require('../models/Appliance');

// @desc    Get all appliance schedules
// @route   GET /api/schedules
// @access  Public
const getSchedules = async (req, res, next) => {
  try {
    let schedules = await Schedule.find().populate('applianceId', 'name powerRating status');

    if (schedules.length === 0) {
      const appliances = await Appliance.find();
      if (appliances.length > 0) {
        const defaultSchedules = [
          {
            applianceId: appliances[0]._id,
            applianceName: appliances[0].name,
            scheduledStart: '01:00',
            scheduledEnd: '05:00',
            powerConsumption: appliances[0].powerRating,
            source: 'RL Agent',
            status: 'scheduled',
            estimatedCost: 1.15
          },
          {
            applianceId: appliances[1]._id,
            applianceName: appliances[1].name,
            scheduledStart: '11:00',
            scheduledEnd: '13:00',
            powerConsumption: appliances[1].powerRating,
            source: 'Automatic',
            status: 'scheduled',
            estimatedCost: 0.33
          }
        ];

        await Schedule.insertMany(defaultSchedules);
        schedules = await Schedule.find().populate('applianceId', 'name powerRating status');
      }
    }

    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Public
const createSchedule = async (req, res, next) => {
  try {
    const { applianceId, scheduledStart, scheduledEnd, powerConsumption, source, status, estimatedCost } = req.body;

    if (!applianceId || !scheduledStart || !scheduledEnd) {
      res.status(400);
      throw new Error('Please provide applianceId, scheduledStart, and scheduledEnd');
    }

    const appliance = await Appliance.findById(applianceId);
    if (!appliance) {
      res.status(404);
      throw new Error('Appliance not found');
    }

    const schedule = await Schedule.create({
      applianceId,
      applianceName: appliance.name,
      scheduledStart,
      scheduledEnd,
      powerConsumption: powerConsumption || appliance.powerRating,
      source: source || 'Manual',
      status: status || 'scheduled',
      estimatedCost: estimatedCost || 0,
      userId: req.user ? req.user._id : null
    });

    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Public
const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      res.status(404);
      throw new Error('Schedule not found');
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Public
const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      res.status(404);
      throw new Error('Schedule not found');
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
