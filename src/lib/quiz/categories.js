export function getCategoryInfo(category){
  const info = gci(category);

  return info;
}

function gci(category){
  switch (category){
    case 'geography':
      return {
        bgColor: 'bg-blue-400',
        borderColor: 'border-blue-400',
      }
    case 'art & literature':
      return {
        bgColor: 'bg-amber-600',
        borderColor: 'border-amber-600',
      }
    case 'history':
      return {
        bgColor: 'bg-yellow-300',
        borderColor: 'border-yellow-300',
      }
    case 'music':
      return {
        bgColor: 'bg-pink-400',
        borderColor: 'border-pink-400',
      }
    case 'film & tv':
      return {
        bgColor: 'bg-teal-300',
        borderColor: 'border-teal-300',
      }
    case 'sports':
      return {
        bgColor: 'bg-orange-400',
        borderColor: 'border-orange-400',
      }
    case 'science': {
      return {
        bgColor: 'bg-green-500',
        borderColor: 'border-green-500',
      }
    }
    case '':
      return {
        bgColor: 'bg-slate-200',
        borderColor: 'border-slate-200',
      }
    case 'general':
    default:
      return {
        bgColor: 'bg-red-400',
        borderColor: 'border-red-400',
      }
  }
}