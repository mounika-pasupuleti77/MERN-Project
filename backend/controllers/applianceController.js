const Appliance = require('../models/Appliance');

// Default initial appliances for smart home seeding
const DEFAULT_APPLIANCES = [
  { name: 'EV Charger', type: 'heavy', powerRating: 3.2, duration: 4, priority: 5, status: 'OFF', preferredStartTime: '00:00', preferredEndTime: '06:00' },
  { name: 'Washing Machine', type: 'flexible', powerRating: 1.1, duration: 2, priority: 3, status: 'OFF', preferredStartTime: '10:00', preferredEndTime: '15:00' },
  { name: 'Dishwasher', type: 'flexible', powerRating: 1.0, duration: 1.5, priority: 2, status: 'OFF', preferredStartTime: '12:00', preferredEndTime: '16:00' },
  { name: 'HVAC System', type: 'critical', powerRating: 2.5, duration: 8, priority: 4, status: 'ON', preferredStartTime: '06:00', preferredEndTime: '22:00' },
  { name: 'Water Heater', type: 'heavy', powerRating: 2.0, duration: 3, priority: 4, status: 'ON', preferredStartTime: '05:00', preferredEndTime: '09:00' }
];

// @desc    Get all appliances (Auto-seeds default appliances if empty)
// @route   GET /api/appliances
// @access  Public / Optional Auth
const getAppliances = async (req, res, next) => {
  try {
    let appliances = await Appliance.find();
    
    // Auto seed default appliances if database is empty
    if (appliances.length === 0) {
      appliances = await Appliance.insertMany(DEFAULT_APPLIANCES);
    }
    
    res.json(appliances);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appliance
// @route   POST /api/appliances
// @access  Public / Optional Auth
const createAppliance = async (req, res, next) => {
  try {
    const { name, type, powerRating, duration, priority, status, preferredStartTime, preferredEndTime } = req.body;

    if (!name || powerRating === undefined) {
      res.status(400);
      throw new Error('Please provide appliance name and power rating (kW)');
    }

    const appliance = await Appliance.create({
      name,
      type: type || 'standard',
      powerRating,
      duration: duration || 1,
      priority: priority || 3,
      status: status || 'OFF',
      preferredStartTime: preferredStartTime || '00:00',
      preferredEndTime: preferredEndTime || '23:59',
      userId: req.user ? req.user._id : null
    });

    res.status(201).json(appliance);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appliance by ID
// @route   GET /api/appliances/:id
// @access  Public
const getApplianceById = async (req, res, next) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (appliance) {
      res.json(appliance);
    } else {
      res.status(404);
      throw new Error('Appliance not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update appliance
// @route   PUT /api/appliances/:id
// @access  Public
const updateAppliance = async (req, res, next) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      res.status(404);
      throw new Error('Appliance not found');
    }

    const updatedAppliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAppliance);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appliance
// @route   DELETE /api/appliances/:id
// @access  Public
const deleteAppliance = async (req, res, next) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      res.status(404);
      throw new Error('Appliance not found');
    }

    await appliance.deleteOne();
    res.json({ message: 'Appliance removed successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle appliance status (ON/OFF)
// @route   PATCH /api/appliances/:id/status
// @access  Public
const toggleApplianceStatus = async (req, res, next) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      res.status(404);
      throw new Error('Appliance not found');
    }

    const newStatus = req.body.status || (appliance.status === 'ON' ? 'OFF' : 'ON');
    appliance.status = newStatus;
    await appliance.save();

    res.json({
      message: `Appliance ${appliance.name} status updated to ${newStatus}`,
      appliance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppliances,
  createAppliance,
  getApplianceById,
  updateAppliance,
  deleteAppliance,
  toggleApplianceStatus
};
