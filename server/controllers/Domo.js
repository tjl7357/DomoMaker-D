// Requires
const models = require('../models');

const { Domo } = models;

// Renders the Page
const makerPage = async (req, res) => {
  return res.render('app');
};

// Function for creating a Domo
const makeDomo = async (req, res) => {
  console.log(req.body);

  // Checks if a name, job, and age are present
  if (!req.body.name || !req.body.age || !req.body.job) {
    return res.status(400).json({ error: 'All Fields are Required!' });
  }

  // Checks if the age is a number
  const parsed = parseInt(req.body.age, 10);
  if (Number.isNaN(parsed)) return res.status(400).json({ error: 'Age must be a number' });

  // Creates the Data
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    job: req.body.job,
    owner: req.session.account._id,
  };

  // Try to save the new Domo object
  try {
    const newDomo = new Domo(domoData);
    newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, job: newDomo.job});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo Already Exists!' });
    }
    return res.status(500).json({ error: 'An Error Occured Making Domo!' });
  }
};

// Get Domos
const getDomos = async(req, res) => {
  try {
    const query = {owner: req.session.account._id};
    const docs = await Domo.find(query).select('name age job').lean().exec();

    return res.json({domos: docs});
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: 'Error Retrieving Domos!'});
  }
};

// Exports
module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
