import React, { useState, createContext, useContext, useEffect } from "react";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { updateMenuStyleSettings } from "../../redux/thunks/employee";
import { getUserInfo } from "../../redux/thunks/authUser";
import secureLocalStorage from "react-secure-storage";
const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

const ThemeProvider = ({ ...props }) => {
  const dispatch = useDispatch();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const loginpref = secureLocalStorage?.getItem("pref")?.pref;
  // console.log("user", settings);

  // useEffect(() => {
  //   dispatch(getUserInfo(loginpref));
  // }, [loginpref, dispatch]);

  const defaultTheme = {
    main: "main", //other value can be passed "bordered"
    sidebar: "white", //other value can be passed "light,dark,theme"
    menuStyle: settings?.menu_style,
    sidebarCompact: true,
    sidebarVisibility: false,
    sidebarMobile: false,
    header: "white", //other value can be passed "light,dark,theme"
    skin: "light", //other value can be passed "dark"
    // main: "default", //other value can be passed "clean,shady,softy"
    // sidebarVisibility: false,
    // sidebarMobile: false,
    // header: "white", //other value can be passed "light,dark,white"
    // skin: "light", //other value can be passed "dark"
  };
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    if(settings?.menu_style){
      setTheme({ ...theme, menuStyle: settings?.menu_style });
    }
  }, [theme, settings]);

  const themeUpdate = {
    uistyle: function (value) {
      setTheme({ ...theme, main: value });
    },
    menuStyle: async function (value) {
      const passData = {
        menu_style: value,
      };
      try {
        await dispatch(updateMenuStyleSettings(passData)).unwrap();
        dispatch(getUserInfo(loginpref));
        // setTheme({ ...theme, menuStyle: value });
      } catch (error) {
        console.error(error);
      }
    },
    sidebar: function (value) {
      setTheme({ ...theme, sidebar: value });
    },
    sidebarCompact: function (e) {
      setTheme({ ...theme, sidebarCompact: !theme.sidebarCompact });
    },
    sidebarVisibility: function (e) {
      setTheme({ ...theme, sidebarVisibility: !theme.sidebarVisibility });
    },
    sidebarHide: function (e) {
      setTheme({ ...theme, sidebarVisibility: false });
    },
    header: function (value) {
      setTheme({ ...theme, header: value });
    },
    skin: function (value) {
      setTheme({ ...theme, skin: value });
    },
    reset: function (e) {
      setTheme({
        ...theme,
        main: defaultTheme.main,
        sidebar: defaultTheme.sidebar,
        header: defaultTheme.header,
        skin: defaultTheme.skin,
      });
    },
  };

  const bodyClass = classNames({
    "nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme": true,
  });

  useEffect(() => {
    const body = document.querySelector("body");
    body.className = bodyClass;
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (theme.main === "default") {
      body.classList.add("ui-default");
      body.classList.remove("ui-bordered");
    }
    if (theme.main === "bordered") {
      body.classList.add(`ui-bordered`);
      body.classList.remove("ui-default");
    }
    if (theme.skin === "dark") {
      body.classList.add(`dark-mode`);
    } else {
      body.classList.remove("dark-mode");
    }
    if (theme.sidebarVisibility === true) {
      body.classList.add("nav-shown");
    } else {
      body.classList.remove("nav-shown");
    }
  }, [theme]);

  useEffect(() => {
    const handleMobileSidebar = () => {
      if (window.innerWidth < 1200) {
        setTheme({ ...theme, sidebarMobile: true });
      } else {
        setTheme({ ...theme, sidebarMobile: false, sidebarVisibility: false });
      }
    };

    handleMobileSidebar();
    window.addEventListener("resize", handleMobileSidebar);
    return () => {
      window.removeEventListener("resize", handleMobileSidebar);
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={themeUpdate}>{props.children}</ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;

// import React, { useState, createContext, useContext, useEffect } from 'react';
// import classNames from "classnames";
// const ThemeContext = createContext();
// const ThemeUpdateContext = createContext();

// export function useTheme(){
//     return useContext(ThemeContext);
// }

// export function useThemeUpdate(){
//   return useContext(ThemeUpdateContext);
// }

// const ThemeProvider = ({...props}) => {

//   const defaultTheme = {
//     main: "default", //other value can be passed "clean,shady,softy"
//     sidebarVisibility: false,
//     sidebarMobile: false,
//     header: "white", //other value can be passed "light,dark,white"
//     skin: "light", //other value can be passed "dark"
//   }
//     const [theme, setTheme] = useState(defaultTheme);

//     const themeUpdate = {
//       uistyle : function(value){
//         setTheme({...theme, main : value})
//       },
//       sidebarVisibility : function(e){
//         setTheme({...theme, sidebarVisibility : !theme.sidebarVisibility})
//       },
//       sidebarHide : function(e){
//         setTheme({...theme, sidebarVisibility : false})
//       },
//       header : function(value){
//         setTheme({...theme, header : value})
//       },
//       skin : function(value){
//         setTheme({...theme, skin : value})
//       },
//       reset : function(e){
//         setTheme({...theme, main : defaultTheme.main, sidebar: defaultTheme.sidebar, header: defaultTheme.header, skin: defaultTheme.skin })
//       },
//     }

//     const bodyClass = classNames({
//       "nk-body bg-lighter npc-invest has-touch nk-nio-theme": true,
//     });

//   useEffect(() => {
//     const body = document.querySelector('body');
//     body.className = bodyClass;
//   }, []);

//   useEffect(() => {
//     const body = document.querySelector('body');
//     if(theme.main === "default"){
//       body.classList.add("ui-default")
//       body.classList.remove("ui-clean", "ui-shady", "ui-softy")
//     }
//     if(theme.main === "clean"){
//       body.classList.add(`ui-clean`)
//       body.classList.remove("ui-default", "ui-shady", "ui-softy")
//     }
//     if(theme.main === "shady"){
//       body.classList.add(`ui-shady`)
//       body.classList.remove("ui-default", "ui-clean", "ui-softy")
//     }
//     if(theme.main === "softy"){
//       body.classList.add(`ui-softy`)
//       body.classList.remove("ui-default", "ui-clean", "ui-shady")
//     }
//     if(theme.skin === "dark"){
//       body.classList.add(`dark-mode`)
//     }else{
//       body.classList.remove("dark-mode")
//     }
//     if(theme.sidebarVisibility === true){
//       body.classList.add("nav-shown")
//     }else{
//       body.classList.remove("nav-shown")
//     }
//   }, [theme]);

//   useEffect(() => {
//     const handleMobileSidebar = () => {
//         if (window.innerWidth < 992) {
//           setTheme({...theme, sidebarMobile : true})
//         } else {
//           setTheme({...theme, sidebarMobile : false, sidebarVisibility : false})
//         }
//     }

//     handleMobileSidebar();
//     window.addEventListener('resize', handleMobileSidebar);
//     return () => {
//      window.removeEventListener('resize', handleMobileSidebar);
//     };
//   }, []);

//   return (
//     <ThemeContext.Provider value={theme} >
//       <ThemeUpdateContext.Provider value={themeUpdate}>
//         {props.children}
//       </ThemeUpdateContext.Provider>
//     </ThemeContext.Provider>
//   )
// }
// export default ThemeProvider;
