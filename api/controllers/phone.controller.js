const db = require("../models");
const Phones = db.phones;
const Op = db.Sequelize.Op;

// Create phone
exports.create = (req, res) => {
    const phoneData = {
        name: req.body.name,
        number: req.body.number,
        contactId: req.body.contactId,
      };

    Phones.create(phoneData)
        .then(data => {
            res.send(data); 
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a phone."
            });
        });
};

// Get all phones
exports.findAll = (req, res) => {
    
    Phones.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving phones."
            });
        });
};

// Get one phone by id
exports.findOne = (req, res) => {
    const id = req.params.phoneId;

    Phones.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data); // Respond with the found phone
            } else {
                res.status(404).send({
                    message: `Phone with id ${id} not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving a phone."
            });
        });
};

// Update one phone by id
exports.update = (req, res) => {
    const id = req.params.phoneId; // Assuming the phone ID is passed as a route parameter
    const updatedData = req.body; // Assuming the updated data is in the request body

    Phones.update(updatedData, {
        where: { id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Phone was updated successfully." });
            } else {
                res.status(404).send({
                    message: `Phone with id ${id} not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the phone."
            });
        });
};

// Delete one phone by id
exports.delete = (req, res) => {
    const id = req.params.phoneId;

    Phones.destroy({
        where: { id: id },
      })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Phone was deleted successfully." });
            } else {
                res.status(404).send({
                    message: `Phone having id ${id} not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the phone."
            });
        });
};