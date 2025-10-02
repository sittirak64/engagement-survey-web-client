import { ref } from 'vue';

export function modalMixins() {
  const engege_One = ref('Please check your data. We will see you soon.');
  const default360 = ref(`The purpose of this survey is to evaluate your 
    teamwork capabilities and gather data for further development. 
    We aim to use the insights from this survey to enhance the overall employee experience. 
    The survey consists of 6 dimensions, each using a 5-point Likert scale, along with some open-ended questions`);
    const degree_one = ref('Thank you for participating in the survey.');
    const degree_Two = ref('Your response is valuable and greatly appreciate !');

  return {
    engege_One,
    default360,
    degree_one,
    degree_Two
  };
}
