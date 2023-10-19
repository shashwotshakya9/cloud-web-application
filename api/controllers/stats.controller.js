const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Calculate stats
exports.calculate = async (req, res) => {
  try {
    const contactCount = await Contacts.count();
    const phoneCount = await Phones.count();
    const contactTimestamps = await Contacts.findOne({
      attributes: [
        [db.Sequelize.fn('max', db.Sequelize.col('createdAt')), 'newestContactTimestamp'],
        [db.Sequelize.fn('min', db.Sequelize.col('createdAt')), 'oldestContactTimestamp']
      ]
    });

    const { newestContactTimestamp, oldestContactTimestamp } = contactTimestamps.dataValues;

    const stats = {
      totalContacts: contactCount,
      totalPhones: phoneCount,
      newestContactTimestamp,
      oldestContactTimestamp
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({
      message: "Error while calculating statistics.",
      error: err
    });
  }
};