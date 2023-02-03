export function capitalise(word) {
  if(!word){
    return;
  }
  const words = word.split(" ");
  for(let i=0; i < words.length; i++){
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  const capitalisedWords = words.join(" ");
  return capitalisedWords;
}