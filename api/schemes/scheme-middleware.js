const Schemes = require("./scheme-model.js");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params;
  const scheme = await Schemes.findById(scheme_id);
  try {
    if (!scheme_id) {
      next({
        status: 404,
        message: `scheme with scheme_id ${scheme_id} not found`,
      });
    } else {
      req.schemes = scheme;
      next();
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  try {
    if (req.body.scheme_name || !req.body.scheme_name.trim()) {
      next({
        status: 400,
        message: "invalid scheme_name",
      });
    } else {
      req.body.scheme_name = req.body.scheme_name.trim()
      res.json(req.schemes);
      next();
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = async (req, res, next) => {
  const { instructions, step_number } = req.body;
  const step = await Schemes.addStep(req.body);
  try {
    if (!instructions || !instructions.trim()) {
      next({
        status: 400,
        message: "invalid step",
      });
    } else if (isNaN(step_number)) {
      next({
        status: 400,
        message: "invalid step",
      });
    } else if (step_number < 1) {
      next({
        status: 400,
        message: "invalid step",
      });
    } else {
      req.step = step;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
