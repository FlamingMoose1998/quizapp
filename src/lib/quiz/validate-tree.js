import { v4 as uuidv4 } from 'uuid';
import { binFileExists, getQuiz } from '../data.js';
import { ObjectValidator } from '@/lib/object-validator.js';


export {
  validateQuizByName,
  validateQuiz,
}

const autoFixers = {
  setUuid: (o, key, id) => { o[key] = uuidv4(); },
  setFullName: (o, key, id) => { o.fullName = `${o.name} - ${o.number}` },
  forceToString: (o, key, id) => { o[key] = o[key].toString(); },
  setDefaultValue10: (o, key, id) => { o[key] = 10 },
}

async function validateQuizByName(name){
  console.log('validateQuizByName', name)
  const quizJson = await getQuiz({ name });
  const result = await validateQuiz(quizJson);

  return result;
}

async function validateQuiz(quizJson){
  const id = 'quiz'
  const ov = ObjectValidator(quizJson, id)
    .isString('uuid', autoFixers.setUuid)
    .isString('name')
    .isString('number')
    .isString('fullName', autoFixers.setFullName)
    .getResult();

  const valQuiz = ov.getResult();

  valQuiz.valRounds = await Promise.all(quizJson.rounds.map(async (roundJson, roundIndex) => {
    const roundId = `R${roundIndex + 1}`;
    const valRound = await validateRound(roundJson, roundId);

    return valRound;
  }))

  valQuiz.valid = valQuiz.valid && valQuiz.valRounds.every(round => round.valid);
  valQuiz.autoFix = valQuiz.valRounds.some(round => round.autoFix);

  quizJson.valid = valQuiz.valid;

  return valQuiz;
}

async function validateRound(roundJson, roundId) {
  const ov = ObjectValidator(roundJson, roundId)
    .isString('uuid', autoFixers.setUuid)
    .isString('name')
    .isString('type')
    .isNumber('roundNumber')
    .isString('roundBinFolderPath')
    .isNumber('nrQuestions', autoFixers.setDefaultValue10)

  if (roundJson.type === '1ak') {
    ov.isArray('answers')
    ov.isString('media');
  }
  let valRound = ov.getResult().getResult();
  valRound.id = roundId;

  if (roundJson.type === '1ak') {
    return valRound;
  }

  valRound.valQuestions = await Promise.all(roundJson.questions.map(async (questionJson, questionIndex) => {
    const questionId = `${roundId}Q${questionIndex + 1}`;
    const valQuestion = await validateQuestion(questionJson, questionId);
    return valQuestion;
  }))

  valRound.valid = valRound.valid && valRound.valQuestions.every(question => question.valid);
  valRound.autoFix = valRound.valQuestions.some(question => question.autoFix);

  roundJson.valid = valRound.valid;

  return valRound;
}

async function validateQuestion(questionJson, questionId){
  const ov = ObjectValidator(questionJson, questionId)
    .isString('uuid', autoFixers.setUuid)
    .isString('nr', autoFixers.forceToString)
    .isString('text-nl')
    .isString('answer-nl')
    .isNumber('difficulty')
    .isString('category')
    .isString('media-type')
    .isString('media')
    .isString('media-path');

  await ov.isCustom(() => binFileExists(questionJson['media-path'], questionJson.media), { value: `${questionJson['media-path']}/${questionJson.media}` })

  const valQuestion = ov.getResult().getResult();
  valQuestion.id = questionId;
  questionJson.valid = valQuestion.valid;

  return valQuestion;
}


