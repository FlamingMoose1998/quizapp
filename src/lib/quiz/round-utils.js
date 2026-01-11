export function getNrFilledQuestions(roundJson){
  if (roundJson.type === 'normal'){
    const filledQuestions = roundJson.questions.filter(questionIsNotEmpty);
    return filledQuestions.length;
  }

  if (roundJson.type === '1234'){
    // something something
  }

  if (roundJson.type === '1ak'){
    return null;
  }
}

export function questionIsNotEmpty(questionJson){
  if (questionJson.type === 'normal'){
    if (questionJson['text-nl']) return true;
    if (questionJson['answer-nl']) return true;

    return false;
  }
  
  if (questionJson.type === '1234'){

  }
}