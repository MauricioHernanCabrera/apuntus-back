const { InstitutionModel, SubjectModel } = require('./../models');
const boom = require('@hapi/boom');

class InstitutionService {
  getAll() {
    return InstitutionModel.find()
      .select('name')
      .sort({ nameSort: 1 });
  }

  createOne({ data }) {
    return InstitutionModel.create(data);
  }

  async getSubjects({ _id }) {
    const institution = await InstitutionModel.findById(_id)
      .orFail(boom.notFound('No se encontro la institución'))
      .populate({
        path: 'subjects',
        select: ['name', '_id']
      });
    return institution.subjects;
  }

  async createSubject({ data, _id }) {
    const subjectCreated = await SubjectModel.create({
      name: data.name,
      institution: _id
    });

    await InstitutionModel.findOneAndUpdate(
      { _id, subjects: { $ne: subjectCreated._id } },
      {
        $push: { subjects: subjectCreated }
      },
      { new: true }
    )
      .populate({
        path: 'subjects',
        sort: 'nameSort'
      })
      .orFail(boom.badRequest('Fallo al agregar materia a la institution'));

    return subjectCreated;
  }
}

module.exports = InstitutionService;