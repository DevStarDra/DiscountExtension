import React, { useEffect, useState } from "react";
import { SearchComponent } from "./components";
import RightSelector from "./RightSelector";
import { getURL, startWithNumber, startWithSpecial } from "../../core/common";
import { useMemoryRouter } from "../../store/memory-router";
import { useAuth } from "../../store/use-auth";
import { ISDEV } from "../../core/helper";
import { elements } from "chart.js";
import User from "../../models/user";
import { NotificationManager } from "react-notifications";
import { useMultiLanguage } from "../../store/multi-language";
import Button from "./Button";

const selecterValues = [
  "#",
  "123",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const ComboSelect = ({ isSelect, item }) => { 
  return (
    <div
      className="w-full flex justify-between items-center mt-2"
      style={{ height: "34px" }}
    >
      <div className="flex flex-row items-center ml-4">
        <img style={{ width: "21px", height: "21px" }} src={item.logoUrl} />
        <div className="flex flex-col ml-4">
          <div className="text-base bold">{item.storeName}</div>
          <div style={{ fontSize: "10px", fontWeight: "bold" }}>
            {item.cashback}
          </div>
        </div>
      </div>
      <div className="radio-button mr-2">
        {isSelect && <div className="select" />}
      </div>
    </div>
  );
};

const Content = ({ filterStores, selectedRows, setSelectedRows }) => {
  const [rightSelector, setRightSelector] = useState("#");
  const [viewScopeRange, setViewScopeRange]= useState([]);
  const [viewStoreRange, setViewStoreRange] = useState([]);
  const [scopeStart, setScopeStart] = useState(0);
  const [refStoreList, setRefStoreList] = useState(null); 


  const changeSelectedRows = (idStore) => {
    let rows = [...selectedRows];
    let pos = rows.lastIndexOf(idStore);
    if (pos > -1) rows.splice(pos, 1);
    else rows.push(idStore);
    setSelectedRows(rows);
  }; 

  useEffect(()=>{
    let firstLetters = [];
    filterStores.map(element=>{
      if(startWithSpecial(element.storeName.charAt(0))) firstLetters.push('#');
      else if(startWithNumber(element.storeName.charAt(0))) firstLetters.push('123')
      else firstLetters.push(element.storeName.charAt(0).toUpperCase())
    })
    firstLetters = [...new Set(firstLetters)]
    setViewScopeRange(firstLetters)
    let i = 0;
    firstLetters = [];
    while( i < 8){
      if(filterStores[i] && filterStores[i].storeName){ 
        if(startWithSpecial(filterStores[i].storeName.charAt(0))) firstLetters.push('#');
        else if(startWithNumber(filterStores[i].storeName.charAt(0))) firstLetters.push('123')
        else firstLetters.push(filterStores[i].storeName.charAt(0).toUpperCase())
      }
      i++;
    }
    firstLetters = [...new Set(firstLetters)]
    setViewStoreRange(firstLetters)
  }, [filterStores])

  useEffect(()=>{
    let i = 0;
    let firstLetters = [];
    while( i < 8){
      if(filterStores[scopeStart+i] && filterStores[scopeStart + i].storeName){ 
        if(startWithSpecial(filterStores[scopeStart + i].storeName.charAt(0))) firstLetters.push('#');
        else if(startWithNumber(filterStores[scopeStart + i].storeName.charAt(0))) firstLetters.push('123')
        else firstLetters.push(filterStores[scopeStart + i].storeName.charAt(0).toUpperCase())
      }
      i++;
    }
    firstLetters = [...new Set(firstLetters)]
    setViewStoreRange(firstLetters)
  }, [scopeStart])

  useEffect(() => {
    if (refStoreList) {
      refStoreList.addEventListener("scroll", (event) => {
        setScopeStart(Math.floor(refStoreList.scrollTop/42));
      });
    }
  }, [refStoreList]);

  useEffect(() => {
    let pos = -1;
    if (rightSelector === "#") pos = 0;
    else if (rightSelector === "123")
      pos = filterStores.findIndex((element) => /^\d/.test(element.storeName));
    else
      pos = filterStores.findIndex((element) =>
        element.storeName.startsWith(rightSelector.toLowerCase())
      );
    if (pos > -1)
      refStoreList &&
        refStoreList.scrollTo({ left: 0, top: 42 * pos, behavior: "smooth" });
  }, [rightSelector]);

  return (
    <div className="flex flex-row justify-between">
      <div style={{ width: 285, height: 328, overflowY: "hidden" }}>
        <div
          ref={(ref) => setRefStoreList(ref)}
          id="favor-store-list"
          className="ml-1 mt-2"
          style={{ height: 328, overflowY: "auto" }}
        >
          {filterStores.map((item, index) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                key={index}
                onClick={() => changeSelectedRows(item.idStore)}
              >
                <ComboSelect
                  isSelect={selectedRows.lastIndexOf(item.idStore) > -1}
                  item={item}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginRight: 6, marginLeft: 6, paddingTop: 4,  height: 320 }}>
        <RightSelector
          viewScopeRange={viewScopeRange}
          viewStoreRange={viewStoreRange}
          values={selecterValues}
          selected={rightSelector}
          setSelected={setRightSelector}
        />
      </div>
    </div>
  );
};

const FavoriteEditComponent = ({ isVisible, setIsVisible }) => {
  const router = useMemoryRouter();
  const auth = useAuth();
  const language = useMultiLanguage();
  const [searchText, setSearchText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [stores, setStores] = useState([]);
  const [filterStores, setFilterStores] = useState([]);
  const [viewFavorite, setViewFavorite] = useState(false)

  const saveSetting = async () => {  
    setUploading(true); 
    let favorite_stores = stores.filter(
      (element) => selectedRows.lastIndexOf(element.idStore) > -1
    );
    favorite_stores.map((element)=>{
      for(let key in element){
        if(element[key] === undefined) delete(element[key])
      }
    })
    let user = {
      ...auth.user,
      favorite_stores
    };  
    try {  
      const resp = await User._update(user.id_user, { ...user }); 
      setUploading(false);
      if (resp.state) {
        NotificationManager.success(language.get("save_success"), "", 2000);
        auth.setUser({ ...user });
        if (ISDEV) {
          localStorage.setItem("userInfo", JSON.stringify(user));
        } else {
          chrome.storage.sync.set({ userInfo: user });
        }
      } else NotificationManager.error(resp.message, "", 2000);
    } catch (err) { 
      setUploading(false);
    }
  };

  useEffect(() => {
    let stores = [];
    router.stores.map((item, index) => {
      stores.push({
        logoUrl: item.logo_url,
        idStore: item.id_store,
        storeName: item.domain,
        cashback: item.cashback
      });
    });
    setStores(stores);
    // console.log(stores);
    let rows = [];
    auth.user &&
      auth.user.favorite_stores &&
      auth.user.favorite_stores.map((item, index) => {
        rows.push(item.idStore);
      });
    setSelectedRows(rows);
  }, []);

  useEffect(() => {
    if (stores) {
      let filters = stores;
      if(viewFavorite) filters = filters.filter((element=>selectedRows.includes(element.idStore)))
      setFilterStores(
        filters.filter((element) => element.storeName.includes(searchText))
      );
    }
  }, [searchText, stores, viewFavorite, selectedRows]);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href={getURL("assets/css/drawer.css")}
      />
      <div className="h-full w-full bg-white"></div>
      <div className="drawer-container">
        <div
          className="drawer__backdrop rbd-db"
          style={{ opacity: 1 }}
          onClick={() => setIsVisible(false)}
        ></div>
        <div
          className="drawer rbd-dr"
          style={{ transform: "none", height: 560 }}
        >
          {/* <div className="drawer__handle-wrapper rbd-hw">
                <div className="drawer__handle rbd-h"></div>
            </div> */}
          <div className="drawer__content rbd-cw">
            <div className="flex flex-row items-center justify-between mt-4">
              <div className="text-header-1 text-center ml-6">
                Add or Remove Favorites
              </div>
              <div
                className="mr-4 cursor-pointer"
                onClick={() => setIsVisible(false)}
              >
                X
              </div>
            </div>
            <div className="ml-4 mt-2">
              <SearchComponent
                placeholder="Search retailer or brand"
                search={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div
              id="F-Store-container"
              className="flex flex-col justify-between mx-3 mt-5"
            >
              <div className="flex flex-row justify-between w-full items-center" style={{width:'83%'}}>
                <div className="ml-5 text-xl bold">Stores</div>
                <div className="mr-2 flex items-center cursor-pointer" onClick={()=>{setViewFavorite(!viewFavorite)}}>
                  <img src={getURL("assets/logos/iconHeart.svg")} />
                </div>
              </div>
              <div className="w-full flex flex-row" style={{ height: 328 }}>
                <Content
                  filterStores={filterStores}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
                />
              </div>
            </div>
            <div
              className="absolute text-center my-4 w-full"
              style={{ bottom: 0 }}
            >
              <Button
                style={{
                  width: 250,
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: !auth.user ? "#808080" : "#cc2a36",
                  border: "transparent",
                  color: "white",
                  cursor: 'pointer'
                }}
                onSubmit={() => saveSetting()}
                text={"Save setting"}
                isBlue={false}
                disabled={!auth.user}
                loading={uploading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FavoriteEditComponent;
