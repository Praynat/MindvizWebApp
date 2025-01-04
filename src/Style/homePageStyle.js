const homePageStyle = (theme) => ({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding:"0 30px"
    },
    header: {
      fontFamily: "roboto",
      mt: "120px",
      fontWeight: "600",
      fontSize:  { xs: "37px", sm: "66px" },
      color: theme.strongTextColor,
      textAlign: { xs: "center", sm: "center" },
    },
    subHeader: {
      fontFamily: "Open-Sans",
      mt: "10px",
      fontWeight: "100",
      fontSize: { xs: "17px", sm: "20px" },
      color: theme.midTextColor,
      textAlign: { xs: "center", sm: "left" },
    },
    buttonContainer: {
      display: "flex",
      gap: "20px",
      mt: "50px",
      mb: "68px",
    },
    button: {
      background: theme.actionColor,
      borderRadius: "16px",
    },
    gallery: {
      paddingTop: "68px",
      marginTop: "-68px",
    },
  });
  
  export default homePageStyle;
  