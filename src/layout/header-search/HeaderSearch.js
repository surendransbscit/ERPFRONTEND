import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/icon/Icon";
import { getSearchItems } from "../../redux/thunks/coreComponent";
import MenuSearchModal from "../../components/modals/MenuSearchModal";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { LinkList } from "../../components/Component";

// const HeaderSearch = () => {
//   return (
//     <React.Fragment>
//       <Icon name="search"></Icon>
//       <input className="form-control border-transparent form-focus-none" type="text" placeholder="Search any thing" />
//     </React.Fragment>
//   );
// };

const HeaderSearch = () => {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchItemsList } = useSelector((state) => state.coreCompReducer);

  const handleResultClick = (result) => {
    navigate(`${process.env.PUBLIC_URL + result?.link}`);
    // dispatch({ type: "searchItems/reset" });
    setQuery("");
  };

  useEffect(() => {
    if (query?.length > 0) {
      dispatch(getSearchItems({ search: query }));
    } else {
      dispatch({ type: "searchItems/reset" });
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (searchItemsList?.length > 0) {
      setModal(true);
    } else {
      setModal(false);
    }
  }, [searchItemsList]);

  // return (
  //   <React.Fragment>
  //     <Icon name="search" />
  //     <input
  //       className="form-control border-transparent form-focus-none"
  //       type="text"
  //       placeholder="Search anything"
  //       value={query}
  //       onChange={(e) => {
  //         setQuery(e.target.value);
  //         // dispatch(getSearchItems({ search: e.target.value }));
  //       }}
  //     />

  //     <MenuSearchModal
  //       data={searchItemsList}
  //       modal={modal}
  //       handleResultClick={handleResultClick}
  //       toggle={toggle}
  //     />
  //   </React.Fragment>
  // );

  return (
    <Dropdown isOpen={modal} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <React.Fragment>
          <Icon name="search" />
          <input
            className="form-control border-transparent form-focus-none"
            type="text"
            placeholder="Search Menus"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // dispatch(getSearchItems({ search: e.target.value }));
            }}
          />
        </React.Fragment>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-xl dropdown-menu-s1">
        <div className="dropdown-inner">
          <LinkList>
            <ul className="search-results">
              {searchItemsList?.map((result, index) => (
                <li
                  key={index}
                  className="search-result-item d-flex align-items-center"
                  onClick={() => handleResultClick(result)}
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <Icon
                    name="menu"
                    className="mr-2"
                    style={{ marginRight: "0.5rem" }}
                  />
                  {result.text}
                </li>
              ))}
            </ul>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderSearch;