import './App.css';
import { BrowserRouter} from 'react-router-dom';
import Router from './Routes/Router';
import Layout from './Layout/Layout';
import { ScrollProvider } from './Layout/Provider/ScrollProvider';
import { CustomThemeProvider } from './Theme/CustomThemeProvider';
import SnackbarProvider from './Providers/Utils/SnackbarProvider';
import { DarkLightThemeProvider } from './Theme/ThemeProvider';
import UserProvider from './Providers/Users/UserProvider';
function App() {
  return(
    <BrowserRouter>
      <UserProvider>
         <DarkLightThemeProvider>
           <CustomThemeProvider>
             <SnackbarProvider>
               <ScrollProvider>
                 {/* <SearchProvider> */}
                   <Layout>
                     <Router/>
                   </Layout>
               {/* </SearchProvider> */}
             </ScrollProvider>
             </SnackbarProvider>
           </CustomThemeProvider>
         </DarkLightThemeProvider>
      </UserProvider>
    </BrowserRouter>
);
}

export default App;
