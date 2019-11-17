const Project = require("../models/Project");

class ProjectController {
  async index(req, res) {
    const projects = await Project.find();
    return res.json(projects);
  }

  async show(req, res) {
    const { id } = req.params;

    const project = await Project.findById(id);
    return res.json(project);
  }

  async store(req, res) {
    const { body } = req;
    const { title } = body;

    const hasProject = await Project.findOne({ title });

    if (hasProject) {
      return res.status(400).json({ error: 'Duplicated project' });
    }

    const project = await Project.create(body);
    return res.status(200).json(project);
  }

  async update(req, res) {
    const { body } = req;
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(id, body, {
      new: true
    });

    return res.json(project);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Project.findByIdAndDelete(id);
    return res.send();
  }
}

module.exports = new ProjectController();
