export async function sortQuizList(quizList){
  const result = {
    open: [],
    closedValid: [],
    closedNotValid: [],
  }

  quizList.forEach(quiz => {
    if (quiz.state === 'draft'){
      result.open.push(quiz);
      return;
    }

    if (quiz.valid){
      result.closedValid.push(quiz);
      return;
    }

    result.closedNotValid.push(quiz);
  })
  
  return result;
}