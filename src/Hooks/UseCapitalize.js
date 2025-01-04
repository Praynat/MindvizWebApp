export default function UseCapitalize(){

    const capitalizeAllFirstLetter = (string) => {
        if (!string) return '';
        const words = string.split(' ');
        const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(' ');
        }

        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
      return {
        capitalizeAllFirstLetter,
        capitalizeFirstLetter
      }
}