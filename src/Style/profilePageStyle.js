
import { useDarkLightTheme } from '../Theme/ThemeProvider';
const useProfileStyles = () => {
    const { theme } = useDarkLightTheme();
    return{
    card: {
      padding: 2,
      maxWidth: 400,
      margin: 'auto',
      backgroundColor:theme.secondaryColor ,
      borderRadius: "10px",
      border: "solid",
      borderColor:theme.cardBorderColor,
      ':hover': {
        boxShadow: 6, // Adds a shadow effect on hover
        borderColor: '#D1D5DB' // Changes border color on hover
      },
      color: theme.strongTextColor,
      textAlign: 'center'
    },
    avatar: {
      backgroundColor: 'primary.main',
      width: 56,
      height: 56,
    },
    title: {
      fontWeight: 'bold',
    },
    nameStyle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    image: {
      height: 150,
      width: 150,
      borderRadius:'50%',
    },
    span: {
      fontWeight: 'normal',
      color: theme.midTextColor,
    }
  };
}
export default useProfileStyles;