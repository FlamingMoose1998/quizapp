// original qls library uses text-nl and answer-nl properties rather than textNl and answerNl

import { getFullLocalRootPath } from '@/lib/data.js'

/**
 * Converts a json to a qls file
 * @param {Object} quizJson
 * @param {number} roundIndex - index (not number) of the round in the quiz
 * @typedef {Object} [options={}]
 * @property {string} [defaultBinDir] - full path name of the default bin dir
 * @property {string} [filterQuestions] - comma separated list, if present only questions with these numbers are processed
 * @property {number} [summarySlideNr] - if present, print the summary to this slide
 * @property {number} [beforeQuestionSlideNr] - if present, create an extra slide before the actual slide
 * @returns {data_type}
 */
export default async function getRoundQls(quizJson, roundIndex, options = {}) {
  options.rootDir = await getFullLocalRootPath();
  const roundJson = quizJson.rounds[roundIndex];


  roundJson.roundNumber = roundIndex + 1;
  roundJson.label = `Ronde ${roundIndex + 1}`;
  roundJson.theme = roundJson.name.replace(/.* - /, '');


  //binFolderPath
  //defaultBinPath
  options.defaultBinDir = `${options.rootDir}\\bin\\${roundJson.roundBinFolderPath}`;

  const result = roundJsonToQls(roundJson, options);

  return result;
}

function roundJsonToQls(roundJson, options) {
  const qlsObjectArray = [];

  let questions = roundJson.questions;
  const hasFilter = (typeof options.filterQuestions === 'string') && (options.filterQuestions !== '')

  if (hasFilter) {
    const filterQuestions = options.filterQuestions.split(',')
    questions = questions.filter(question => filterQuestions.includes(question.nr));
  }

  [false, true].forEach((answerMode) => {
    if (!hasFilter) addRoundJsonData(qlsObjectArray, roundJson, answerMode, options);

    questions.forEach((questionJson, questionIndex) => {
      if (typeof questionJson.type === 'undefined') {
        questionJson.type = roundJson.type;
      }
      if (!hasFilter) addQuestionJsonData(qlsObjectArray, questionIndex, questionJson, answerMode, options)
    })
  });

  const qlsArray = qlsObjectArray.map((qlsObject) => {
    return Object.keys(qlsObject)
      .map((key) => `${key}=${qlsObject[key]}`)
      .join('@@@');
  });

  return qlsArray.join('<EOL>\n');
}

function addRoundJsonData(qlsObjectArray, roundJson, answerMode, options) {
  if (answerMode && options.summarySlideNr) {
    qlsObjectArray.push({
      copySlide: options.summarySlideNr,
      summary: roundJson.questions.map((question, index) => `${index + 1}. ${question['text-nl']}`).join('\n')
    })
  }

  const qlsObject = {};
  qlsObject.copySlide = answerMode ? 3 : 1;
  qlsObject.label = answerMode ? 'ANTWOORDEN' : 'VRAGEN';
  qlsObject.mode = answerMode ? 'answer' : 'question';

  qlsObject.roundNumber = roundJson.roundNumber;
  qlsObject.roundTitle = roundJson.name;
  qlsObject.roundLabel = roundJson.label;
  qlsObject.roundTheme = roundJson.theme;
  // qlsObject.roundDirectory = roundJson.relPathRound;
  qlsObject.defaultBinPath = options.defaultBinDir.replace('/', '\\');

  qlsObjectArray.push(qlsObject);

  return qlsObjectArray;
}

function addQuestionJsonData(qlsObjectArray, questionIndex, questionJson, answerMode, options) {
  let mediaType = questionJson['media-type'];
  let type = questionJson.type;

  if (type === 'video1234'){
    type = '1234';
    mediaType = 'video';
  }

  let copySlides = getTemplateSlideNumber(answerMode, mediaType, type);
  console.log('copySlides', questionIndex, answerMode, mediaType, type, copySlides)

  if (!Array.isArray(copySlides)) copySlides = [copySlides];


  copySlides.forEach(copySlideNr => {
    const qlsObject = {};
    qlsObject.copySlide = copySlideNr;
    qlsObject.questionNr = `Vraag ${questionIndex + 1}`;
    qlsObject.qnr = `${questionIndex + 1}`;

    if (mediaType) {
      qlsObject[mediaType] = questionJson.media;
    }

    if (questionJson['media-path']) {
      qlsObject.binpath = `${options.rootDir}\\bin\\${questionJson['media-path'].replace('/', '\\')}`;
    }

    if (type === '1234' || type === 'video1234') {
      ['p1', 'p2', 'p3', 'p4'].forEach(p => {
        qlsObject[`${p}_question`] = questionJson[p].question;
        qlsObject[`${p}_answer`] = questionJson[p].answer;
      })
    } else {
      qlsObject.question = questionJson['text-nl'];
      qlsObject.answer = questionJson['answer-nl'];
      qlsObject.fullscreen = questionJson.fullscreen || false;
    }

    // if (mediaType === 'video' && type === '1234' && !answerMode) {
    //   qlsObjectArray.push({
    //     ...qlsObject,
    //     copySlide: 7
    //   })
    // }

    if (typeof options.beforeQuestionSlideNr === 'number') {
      const beforeQlsObject = {
        ...qlsObject,
        copySlide: options.beforeQuestionSlideNr,
      }
      qlsObjectArray.push(beforeQlsObject, qlsObject);
    } else {
      qlsObjectArray.push(qlsObject);
    }

  })

}

function getTemplateSlideNumberOrg(answerMode, mediaType = 'image', questionType = 'normal') {
  switch (mediaType) {
    case 'image': return answerMode ? 4 : 2;
    case 'audio': return answerMode ? 6 : 5;
    case 'video':
      if (questionType === 'video1234') {
        return answerMode ? 9 : 8;
      } else {
        return 7;
      }
  }
}

function getTemplateSlideNumber(answerMode, mediaType = 'image', questionType = 'normal') {
  if (!answerMode && mediaType === 'image' && questionType === 'normal') return 2;
  if (answerMode && mediaType === 'image' && questionType === 'normal') return 4;

  if (!answerMode && mediaType === 'audio' && questionType === 'normal') return 5;
  if (answerMode && mediaType === 'audio' && questionType === 'normal') return 6;

  if (!answerMode && mediaType === 'video' && questionType === 'normal') return [7, 2];
  if (answerMode && mediaType === 'video' && questionType === 'normal') return 4;

  if (!answerMode && mediaType === 'video' && questionType === '1234') return [7, 8];
  if (answerMode && questionType === '1234') return 9;

  if (!answerMode && mediaType === 'image' && questionType === '1234') return 10;
  if (!answerMode && mediaType === 'audio' && questionType === '1234') return 11;
}





