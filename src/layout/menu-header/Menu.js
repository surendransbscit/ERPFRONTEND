import React, { useState, useEffect } from "react";
import menu from "./MenuData";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenus } from "../../redux/thunks/coreComponent";
import useAuth from "../../utils/hooks/useAuth";
// import menu from "../menu/MenuData";

const MenuHeader = ({ item }) => {
  return (
    <li className="nk-menu1-heading">
      <h6 className="overline-title text-primary">{item}</h6>
    </li>
  );
};

const MenuItem = ({ item, headActive }) => {
  const { subMenu, subPanel, text, link, newTab, badge, header } = item;

  if (header) {
    return <MenuHeader item={header}></MenuHeader>;
  } else
    return (
      <li
        className={`nk-menu1-item ${subMenu ? "has-sub" : ""} ${
          process.env.PUBLIC_URL + link === window.location.pathname
            ? "active current-page"
            : ""
        } ${headActive ? "active current-page" : ""}`}
      >
        {newTab ? (
          <Link
            className="nk-menu1-link"
            target="_blank"
            rel="noopener noreferrer"
            to={`${process.env.PUBLIC_URL + link}`}
          >
            <span className="nk-menu1-text">{text}</span>
            {subPanel && <span className="nk-menu1-badge">Hot</span>}
          </Link>
        ) : subMenu ? (
          <React.Fragment>
            <a
              href="#toggle"
              className="nk-menu1-link nk-menu1-toggle"
              onClick={(ev) => {
                ev.preventDefault();
              }}
            >
              <span className="nk-menu1-text">{text}</span>
            </a>
            <MenuSub subMenu={subMenu} />
          </React.Fragment>
        ) : (
          <Link className="nk-menu1-link" to={process.env.PUBLIC_URL + link}>
            <span className="nk-menu1-text">{text}</span>
            {badge && <span className="nk-menu1-badge">{badge}</span>}
          </Link>
        )}
      </li>
    );
};

const MenuSub = ({ subMenu }) => {
  return (
    <ul className="nk-menu1-sub">
      {subMenu.map((sub, index) => (
        <MenuItem item={sub} key={index} />
      ))}
    </ul>
  );
};

const checkMenuUrl = (data) => {
  for (const node of data.subMenu) {
    if (process.env.PUBLIC_URL + node.link === window.location.pathname) {
      return node;
    } else {
      const newNode = node.subMenu ? checkMenuUrl(node) : undefined;
      if (newNode) return newNode;
    }
  }
};

const findActiveHead = () => {
  let found;
  menu?.forEach((item) => {
    let finding = item?.subMenu?.find(
      (s) => process.env.PUBLIC_URL + s.link === window.location.pathname
    );
    if (finding) {
      found = item;
    } else {
      item.subMenu?.forEach((p) => {
        if (p.subMenu) {
          let finding = checkMenuUrl(p);
          if (finding) {
            found = item;
          }
        }
      });
    }
  });
  return found;
};

const Menu = () => {
  const [data, setMenuData] = useState();
  const [head, setHead] = useState("Dashboards");
  let findingActiveHead = findActiveHead();
  const dispatch = useDispatch();
  const { authenticated } = useAuth();
  const { menuList } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    if (authenticated) {
      dispatch(getAllMenus());
    }
  }, [dispatch, authenticated]);

  useEffect(() => {
    setMenuData(menuList);
  }, [menuList]);

  useEffect(() => {
    data?.forEach((item, index) => {
      if (item.panel) {
        let found = item.subPanel?.find(
          (sPanel) =>
            process.env.PUBLIC_URL + sPanel.link === window.location.pathname
        );
        if (found) {
          setMenuData([menu[index]]);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (findingActiveHead) {
      setHead(findingActiveHead.text);
    }
  }, [window.location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul className="nk-menu1 nk-menu1-header ui-s2">
      {menuList?.map((item, index) => {
        if (item.text === head) {
          return <MenuItem key={index} item={item} headActive={true} />;
        } else return <MenuItem key={index} item={item} />;
      })}
    </ul>
  );
};

export default Menu;
