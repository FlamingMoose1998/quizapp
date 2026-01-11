import { getQuiz } from "../lib/data.js";
import { ObjectValidator } from "../lib/object-validator.js";
import { binFileExists } from "../lib/data.js";

export {
  validateQuiz,
}

const autoFixers = {
  setUuid: (o, key, id) => { o[key] = uuidv4(); },
  setFullName: (o, key, id) => { o.fullName = `${o.name} - ${o.number}` },
  forceToString: (o, key, id) => { o[key] = o[key].toString(); },
  setDefaultValue10: (o, key, id) => { o[key] = 10 },
}


const name = 'QUIZ-230001 - FMTH25'
const valRes = await testValidateQuiz(name)

async function testValidateQuiz(name){
  const quizJson = await getQuiz({ name });
  const result = validateQuiz(quizJson);
  console.log(result);
}

function validateQuiz(quizJson){
  const id = 'quiz'
  const ov = ObjectValidator(quizJson, id)
    .isString('uuid', autoFixers.setUuid)
    .isString('name')
    .isString('number')
    .isString('fullName', autoFixers.setFullName)
    .getResult();

  const valQuiz = ov.getResult();

  valQuiz.valRounds = quizJson.rounds.map((roundJson, roundIndex) => {
    const roundId = `R${roundIndex + 1}`;
    const valRound = validateRound(roundJson, roundId);

    return valRound;
  })

  return valQuiz;
}

function validateRound(roundJson, roundId) {
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

  if (roundJson.type === '1ak') {
    return valRound;
  }

  valRound.questions = roundJson.questions.map((questionJson, questionIndex) => {
    const questionId = `${roundId}Q${questionIndex + 1}`;
    const valQuestion = validateQuestion(questionJson, questionId);
    return valQuestion;
  })

  return valRound;
}

function validateQuestion(questionJson, questionId){
  const ov = ObjectValidator(questionJson, questionId)
    .isString('uuid', autoFixers.setUuid)
    .isString('nr', autoFixers.forceToString)
    .isString('text-nl')
    .isString('answer-nl')
    .isNumber('difficulty')
    .isString('category')
    .isString('media-type')
    .isString('media')
    .isString('media-path')
    .isCustom(() => binFileExists(questionJson['media-path'], questionJson.media), { value: `${questionJson['media-path']}/${questionJson.media}` })

  const valQuestion = ov.getResult();

  return valQuestion.getResult();
}


