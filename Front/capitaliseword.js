export function capitalise (word) {
    const words = word.split(" ");
    for(let i=0; i < words.length; i++){
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    const capitalisedWords = words.join(" ");
    console.log(capitalisedWords);
    return capitalisedWords;
  }