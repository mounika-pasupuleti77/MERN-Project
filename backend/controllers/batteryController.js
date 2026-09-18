const Battery = require('../models/Battery');

// Helper to get or create battery record
const getOrCreateBattery = async (userId = null) => {
  let battery = await Battery.findOne();
  if (!battery) {
    battery = await Battery.create({
      capacity: 10,
      currentSOC: 50,
      minSOC: 15,
      maxSOC: 95,
      chargeRate: 3.3,
      dischargeRate: 3.3,
      status: 'idle',
      userId
    });
  }
  return battery;
};

// @desc    Get battery status
// @route   GET /api/battery
// @access  Public
const getBatteryStatus = async (req, res, next) => {
  try {
    const battery = await getOrCreateBattery(req.user ? req.user._id : null);
    res.json(battery);
  } catch (error) {
    next(error);
  }
};

// @desc    Update battery settings
// @route   PUT /api/battery
// @access  Public
const updateBattery = async (req, res, next) => {
  try {
    let battery = await getOrCreateBattery(req.user ? req.user._id : null);
    
    const { capacity, minSOC, maxSOC, currentSOC, status, chargeRate, dischargeRate } = req.body;

    if (capacity !== undefined) battery.capacity = capacity;
    if (minSOC !== undefined) battery.minSOC = minSOC;
    if (maxSOC !== undefined) battery.maxSOC = maxSOC;
    if (currentSOC !== undefined) battery.currentSOC = currentSOC;
    if (status !== undefined) battery.status = status;
    if (chargeRate !== undefined) battery.chargeRate = chargeRate;
    if (dischargeRate !== undefined) battery.dischargeRate = dischargeRate;

    await battery.save();
    res.json(battery);
  } catch (error) {
    next(error);
  }
};

// @desc    Charge battery with SOC boundary check
// @route   POST /api/battery/charge
// @access  Public
const chargeBattery = async (req, res, next) => {
  try {
    const battery = await getOrCreateBattery(req.user ? req.user._id : null);
    const amountKWh = Number(req.body.amount) || 1.0; // kWh to add

    // Convert kWh to SOC percentage increase (SOC = (stored_kWh / capacity) * 100)
    const socIncrease = (amountKWh / battery.capacity) * 100;
    const newSOC = battery.currentSOC + socIncrease;

    if (newSOC > battery.maxSOC) {
      res.status(400);
      throw new Error(`Cannot charge beyond maximum SOC limit (${battery.maxSOC}%). Current SOC: ${battery.currentSOC.toFixed(1)}%`);
    }

    battery.currentSOC = Number(newSOC.toFixed(1));
    battery.status = 'charging';
    await battery.save();

    res.json({
      message: `Successfully charged battery by ${amountKWh} kWh`,
      battery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Discharge battery with SOC boundary check
// @route   POST /api/battery/discharge
// @access  Public
const dischargeBattery = async (req, res, next) => {
  try {
    const battery = await getOrCreateBattery(req.user ? req.user._id : null);
    const amountKWh = Number(req.body.amount) || 1.0; // kWh to discharge

    const socDecrease = (amountKWh / battery.capacity) * 100;
    const newSOC = battery.currentSOC - socDecrease;

    if (newSOC < battery.minSOC) {
      res.status(400);
      throw new Error(`Insufficient battery capacity. SOC cannot fall below minimum limit (${battery.minSOC}%). Current SOC: ${battery.currentSOC.toFixed(1)}%`);
    }

    battery.currentSOC = Number(newSOC.toFixed(1));
    battery.status = 'discharging';
    await battery.save();

    res.json({
      message: `Successfully discharged battery by ${amountKWh} kWh`,
      battery
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBatteryStatus,
  updateBattery,
  chargeBattery,
  dischargeBattery
};
