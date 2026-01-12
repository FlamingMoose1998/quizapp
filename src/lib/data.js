'use server'

import fs from 'fs/promises';
import { existsSync } from 'fs';
import { getDateTimeString } from './utils.js';
import getRoundQls from './quiz/qls.js';

const ROOT = './src/data/root';
const JSON_DATA_ROOT = `${ROOT}/quiz/json/`;
const BIN_DATA_ROOT = `${ROOT}/bin/`;
const QLS_DIR = `${ROOT}/qls`

async function getFullLocalRootPath(){
  return 'c:\\Users\\bfransen2\\Documents\\google-drives\\flamingmoose1998\\container';
}

async function getQuizList() {
  const quizListString = await fs.readFile(`${JSON_DATA_ROOT}/quizList.json`, 'utf-8');
  const quizList = JSON.parse(quizListString);

  return quizList;
}

async function getQuiz({ name }) {
  try {
    const fqName = `${JSON_DATA_ROOT}/${name}.json`;
    console.log(fqName)
    const quizString = await fs.readFile(fqName, 'utf-8');
    const quiz = JSON.parse(quizString);

    return quiz;
  } catch (error) {
    return null;
  }
}

async function writeQuiz({ quizJson }){
  const filename = `${quizJson.fullName}.json`;
  const fqFilename = `${JSON_DATA_ROOT}/${filename}`
  const newFilename = `${quizJson.fullName}_${getDateTimeString()}.json`;

  await fs.rename(fqFilename, `${JSON_DATA_ROOT}/archive/${newFilename}`)
  await fs.writeFile(fqFilename, JSON.stringify(quizJson, null, 2), 'utf8');
}

async function binFileExists(relPath, filename){
  return existsSync(`${BIN_DATA_ROOT}/${relPath}/${filename}`);
}

async function writeRoundQls(quizJson, roundIndex){
  const roundJson = quizJson.rounds[roundIndex]
  const qls = await getRoundQls(quizJson, roundIndex);

  fs.writeFile(`${QLS_DIR}/${quizJson.name}-${roundJson.name}.qls`, qls, 'utf8');
}


export {
  getFullLocalRootPath,

  getQuiz,
  getQuizList,
  writeQuiz,
  binFileExists,

  writeRoundQls,
}