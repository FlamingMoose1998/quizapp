import { v4 as uuidv4 } from 'uuid';
import { binFileExists } from '../data.js';
import { ObjectValidator } from '@/lib/object-validator.js';

export {
  validateQuiz,
  validateRound,
  validateQuestion,
  ObjectValidator,
  ValidationResult,
}

const autoFixers = {
  setUuid: (o, key, id) => { o[key] = uuidv4(); },
  setFullName: (o, key, id) => { o.fullName = `${o.name} - ${o.number}` },
  forceToString: (o, key, id) => { o[key] = o[key].toString(); },
  setDefaultValue10: (o, key, id) => { o[key] = 10 },
}

// validates quiz and returns a ValidationResult object
function validateQuiz(quizJson) {
  const ov = ObjectValidator(quizJson, 'quiz')
    .isString('uuid', autoFixers.setUuid)
    .isString('name')
    .isString('number')
    .isString('fullName', autoFixers.setFullName);

  let quizCheckResult = ov.getResult();

  quizJson.rounds.forEach((roundJson, roundIndex) => {
    const roundId = `R${roundIndex + 1}`;
    const roundCheckResult = validateRound(roundJson, roundId);
    quizCheckResult.merge(roundCheckResult);
  })

  return quizCheckResult;
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
  let roundCheckResult = ov.getResult();

  if (roundJson.type === '1ak') {
    return roundCheckResult;
  }

  roundJson.questions.forEach((questionJson, questionIndex) => {
    const questionId = `${roundId}Q${questionIndex + 1}`;
    const questionCheckResult = validateQuestion(questionJson, questionId);
    roundCheckResult.merge(questionCheckResult);
  })

  return roundCheckResult;
}

function validateQuestion(questionJson, questionId) {
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

  const questionCheckResult = ov.getResult();

  return questionCheckResult;
}



function getIndices(key) {
  const re = /(R(\d\d?))(Q(\d\d?))?/
  const match = id.match(re)

  const roundIndex = +match?.[2];
  const questionIndex = +match?.[4];

  return [roundIndex, isNaN(questionIndex) ? null : questionIndex];
}

async function validateFileQuestion(questionJson, questionId) {
  const result = {
    id: questionId,
    checkType: 'file-exists',
    autoFix: false,
    value: `${questionJson.mediaPath}/${questionJson.media}`
  }

  result.valid = await binFileExists(questionJson['media-path'], questionJson.media);
  return result;
}



function validateFiles(quizJson){
  const list = [];
  quizJson.rounds.forEach((roundJson, roundIndex) => {
    if (roundJson.type !== 'normal') return;

    roundJson.questions.forEach(async (questionJson, questionIndex) => {
      const check = await validateFileQuestion(questionJson, `R${roundIndex + 1}Q${questionIndex + 1}`);
      list.push(check);
    })
  })
  console.log('validateFiles', list.length)
  return list;
}


