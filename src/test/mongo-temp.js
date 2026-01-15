async function insertQuiz(quizJson) {
  const collections = {}
  ['quiz', 'round', 'question'].forEach(name => {
    collections[name] = getCollection(name);
  })

  // first go over quiz, rounds and questions
  // make sure all exist (create if necessary) and contain _id
  upsertQuiz(quizJson);
  quizJson.rounds.forEach(roundJson => {
    upsertRound(roundJson);
    roundJson.questions.forEach(questionJson => {
      upsertQuestion(questionJson);
    })
  })


  // go over quiz, rounds and questions again to update the references
  quizJson.rounds.forEach(roundJson => {
    roundJson.questionIds = roundJson.questions.forEach(questionJson => {
      
    })
  })  
}

async function insertRounds(roundJsonList) {
  const ids = await Promise.all(roundJsonList.map(insertRound));
  return ids;
}

async function insertRound(roundJson) {
  let RoundCollection = {};

  roundJson.questionIds = await insertQuestions(roundJson.questions);
  delete roundJson.questions;

  const result = await RoundCollection.insertOne(roundJson);
  return result.insertedId;
}

async function insertQuestions(questionJsonList) {
  let QuestionCollection = {};

  const result = await QuestionCollection.insertMany(questionJsonList);

  return result.insertedIds;
}



function upsert(collection, document){
  // query collection on document.uuid
  // update if exists, otherwise update
  collection.findAndModify()

  return id;
}