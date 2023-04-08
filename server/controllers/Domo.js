// Requires
const models = require('../models');

const { Domo } = models;

// Renders the Page
const makerPage = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();
    return res.render('app', { domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error Retrieving Domos!' });
  }
};

// Function for creating a Domo
const makeDomo = async (req, res) => {
  // Checks if a name and age are present
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both Name and Age are Required!' });
  }

  // Checks if the age is a number
  const parsed = parseInt(req.body.age, 10);
  if (Number.isNaN(parsed)) return res.status(400).json({ error: 'Age must be a number' });

  // Creates the Data
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  // Try to save the new Domo object
  try {
    const newDomo = new Domo(domoData);
    newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo Already Exists!' });
    }
    return res.status(500).json({ error: 'An Error Occured Making Domo!' });
  }
};

// Exports
module.exports = {
  makerPage,
  makeDomo,
};
