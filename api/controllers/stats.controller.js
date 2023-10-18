const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Calculate stats
exports.calculate = (req, res) => {
    Phones.findAll({
        attributes: [
          "contactId",
          [db.Sequelize.fn("COUNT", db.Sequelize.col("contactId")), "phoneCount"],
        ],
        group: ["contactId"],
      })
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err.message }));
};