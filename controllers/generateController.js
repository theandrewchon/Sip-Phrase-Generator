const db = require('../models');

const removePunctuation = (string) => {
  let regex = /[!"#$%&*+,./:;<=>?@[\]^_`{|}~]/g;
  return string.replace(regex, '');
};


module.exports = {
  generate: async function (req, res) {
    const { lang, queries } = req.query
    const database = await db.Sentences.find({})
    let emptyArray = [];
    let sentenceArray = [];
    const arr = removePunctuation(queries.toLowerCase().trim()).split(' ');

    arr.forEach((element) => {
      let temp = database.filter((phrase) => {
        if (lang === 'english') {
          //Filter english words
          if (
            new RegExp(`\\b${element.toLowerCase()}\\b`).test(
              phrase.english.toLowerCase()
            )
          ) {
            return true;
          } else {
            return false;
          }
        } else if (lang === 'korean') {
          //Filter Korean words
          let newStr = removePunctuation(phrase.korean);
          let arr = newStr.split(' ');
          return arr.includes(element);
        }

        //Filter Korean words
      });
      if (temp.length) {
        sentenceArray.push({
          query: element,
          //Returns shortest string
          sentence: temp.reduce((a, b) =>
            a.english.length <= b.english.length ? a : b
          ),
        });
      } else {
        emptyArray.push(element);
      }
    });
    res.json({ empty: emptyArray, sentences: sentenceArray });
  }
}
