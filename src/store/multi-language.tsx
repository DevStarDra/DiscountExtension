import React, { useState, useEffect, useContext, createContext } from "react";
import { ISDEV, IndexedDbName, IndexedDbStoreLanguage, actionCode } from "../core/helper";
import Language from "../models/language"
import { getItem, setItem } from "../core/IndexedDB";


const languageContext = createContext(undefined);

export function ProvideMultiLanguage({ children }) {
    const language = useProvideMultiLanguage();
    return <languageContext.Provider value={language}>{children}</languageContext.Provider>;
}
export const useMultiLanguage = () => {
    return useContext(languageContext);
};

function useProvideMultiLanguage() {
    const [locale, setLocale] = useState('en');
    const [languageList, setLanguageList] = useState([]);
    const [source, setSource] = useState(null);

    const get = (_key) => {
        if (source && source.translation) {
            let filter = source.translation.filter(element => element.string_slug == _key);
            if (filter.length > 0)
                return filter[0].string_translation;
        }
        return _key;
    }

    useEffect(() => {
        if (ISDEV) {
            setLocale(JSON.parse(localStorage.getItem('locale')))
        } else {
            chrome.storage.sync.get().then(result => {
                if (result.locale) setLocale(result.locale)
            })
        }
    }, [])

    useEffect(() => {
        async function getLanguage() {
            let language = await Language.getTranslation(locale)
            let _source = {
                langIso: locale,
                translation: language
            }

            setSource(_source)
            if (locale)
                if (ISDEV) {
                    // localStorage.setItem(`language_${locale}`, JSON.stringify(_source));
                    setItem(IndexedDbStoreLanguage, 'langIso', _source, () => { })
                } else {
                    // chrome.storage.sync.set({ [`language_${locale}`]: _source })
                    // setItem(IndexedDbStoreLanguage, 'langIso', _source, () => { })
                    chrome.runtime.sendMessage({...{code: actionCode.setLanguage, locale, translation: language}})
                }
        }
        async function getLanguageList() {
            let langList = await Language._getAll();
            setLanguageList(langList)
            if (ISDEV) {
                localStorage.setItem('languageList', JSON.stringify(langList))
            } else {
                chrome.storage.sync.set({ 'languageList': langList })
            }
        }
        if (ISDEV) { 
            // const source = JSON.parse(localStorage.getItem(`language_${locale}`));
            getItem(IndexedDbStoreLanguage, 'langIso', locale, ({ state, data }) => { 
                if (state) {
                    setSource(data)
                } else {
                    getLanguage()
                }
            })

            const langList = JSON.parse(localStorage.getItem('languageList'));
            if (langList && langList.length > 0) {
                setLanguageList(langList)
            } else {
                getLanguageList()
            }
            localStorage.setItem('locale', JSON.stringify(locale));
        }
        else {
            // getItem(IndexedDbStoreLanguage, 'langIso', locale, ({ state, data }) => {
            //     if (state) {
            //         setSource(data)
            //     } else {
            //         console.log('get from databasse')
            //         getLanguage()
            //     }
            // })
            chrome.runtime.sendMessage({code: actionCode.getLanguage, locale}, function(result){
                if(result && result.loaded && (Date.now() - result.loaded) < 1000*60*60*24 && result.translation && result.translation.length > 0){
                    setSource({langIso: locale, translation: result.translation})
                }else{ 
                    getLanguage();
                }
            })
            chrome.storage.sync.get().then(result => {
                if (result.languageList && result.languageList.length > 0) {
                    setLanguageList(result.languageList)
                } else {
                    getLanguageList()
                }
            });
            chrome.storage.sync.set({ 'locale': locale })
        }
    }, [locale])

    return {
        locale,
        languageList,
        get,
        setLocale,
        setSource,
        setLanguageList
    };
}