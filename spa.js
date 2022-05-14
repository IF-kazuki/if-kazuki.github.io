/**
 *  sss   pppp     a           j   sss
 * s   s  p   p   a a             s   s
 *  s     pppp   a   a         j   s
 *   s    p      aaaaa         j    s
 *    s   p      a   a         j     s
 * s   s  p      a   a     j   j  s   s
 *  sss   p      a   a  @   jjj    sss
 */

/**
 * @description
 * - functions to get DOM elements
 * - functions to operate local storage
 */
const S = new (class {
  /**
   * @description get dom element
   * @param {string} tag
   * @param {string} id
   * @param {document} doc
   * @returns dom element
   */
  tag = (tag) => document.getElementsByTagName(tag)[0];
  id = (id) => document.getElementById(id);
  tagD = (doc, tag) => doc.getElementsByTagName(tag)[0];
  tagA = (doc, tag) => doc.activeElement.getElementsByTagName(tag)[0];

  /**
   * @description get local storage
   * @param {string} key
   * @param {string} value
   * @returns local storage value
   */
  setLS = (key, value) => localStorage.setItem(key, value);
  getLS = (key) => localStorage.getItem(key);
  delLS = (key) => localStorage.removeItem(key);
})();

/**
 * @description
 * receive html text from URL and set for each tag
 * @param {string} url
 * @param {string} target
 */
const setDOM = (url, target) => {
  const parser = new DOMParser();

  fetch(url).then(async (res) => {
    const html = await res.text();
    const doc = parser.parseFromString(html, "text/html");

    /** dom crear */
    S.tag(target).innerHTML = "";

    /** head tag insert */
    if (S.tagD(doc, "top")) {
      if (S.tag("top")) S.tag("top").remove();
      const head = S.tagD(doc, "top");
      S.tag("head").append(head);
    }

    /** text tag and style tag insert */
    let element = "";
    if (S.tagA(doc, "text")) {
      element += S.tagA(doc, "text").innerHTML;
    } else {
      throw new Error(`missing text tag at ${target}`);
    }
    if (S.tagA(doc, "style")) {
      element += `<style>${S.tagA(doc, "style").innerText}</style>`;
    }
    S.tag(target).innerHTML = element;

    /** script tag insert */
    if (S.tagA(doc, "script")) {
      const script = document.createElement("script");
      script.innerHTML = S.tagA(doc, "script").innerText;

      S.tag(target).appendChild(script);
    }
  });
};

/**
 * @description parent DOM generetion
 * @param {Array<string>} key
 */
const createInitialDom = (key) => {
  for (let i = 0; i < key.length; i++) {
    const dom = document.createElement(key[i]);
    S.id("root").append(dom);
  }
};

/**
 * @description
 * get the URL structure adn apply the script according to the structure
 * @param {*} structure
 * @returns
 * Link
 *  - providers the ability to swap DOM elements
 */
const Main = class {
  constructor(structure) {
    this.url = location.protocol;
    this.modeRoot = "";
    this.backRoot = "";
    const key = Object.keys(structure);
    const value = Object.values(structure);

    /**
     * @description create a script for each structure
     * @param {string} target
     */
    this.assembly = (target) => {
      let params = location.pathname;
      if (this.modeRoot !== "") params = this.modeRoot;
      if (this.backRoot !== "") params = this.backRoot;

      for (let i = 0; i < value.length; i++) {
        if (structure[target]) {
          setDOM(`${this.url}/${target}/${structure[target][params]}`, target);
          break;
        } else if (value[i][params]) {
          setDOM(`${this.url}/${key[i]}/${value[i][params]}`, key[i]);
        }
      }
    };

    /** initial rendering */
    createInitialDom(key);
    this.assembly();

    /** jump to the page ypu were browsing in the past. direct link measures */
    const path = S.getLS("PATH");
    const flag = S.getLS("NOTFOUND");
    if (path !== "/" && flag === "true") {
      this.backRoot = path;
      this.assembly();
      history.replaceState("", "", path);
      this.backRoot = "";
      S.setLS("NOTFOUND", false);
    }
  }

  /**
   * @description switch DOM
   * @param {string} id
   * @param {string} path
   * @param {string} target
   */
  Link = (id, path, target) => {
    if (this.modeRoot !== "") return;

    const a = S.id(id);
    a.onclick = () => {
      history.replaceState("", "", path);

      /** record page transitions */
      S.setLS("PATH", path);

      this.assembly(target);
    };
  };

  /**
   * @description
   * function to get an element from another file
   * @param {string} path
   * @param {string} target
   */
  Import = (path, target) => {
    setDOM(`${this.url}/${path}`, target);
  };

  /**
   * @description
   */
  Cacher = () => {
    // 最初に取得するデータを選択できる機能を作成
    // また取得したデータをキャッシュする機能を作成
  };

  /**
   * @description
   * development function set the specified URL as the index URL
   * @param {string} url
   */
  DevMode = (url) => {
    console.log(`developer mode target path -> ${url}`);

    this.modeRoot = url;
    this.assembly();
  };
};

/**
 * @description
 * a function that returns to the index and rebuilds
 * when the page is visited directly
 */
const NotFound = () => {
  S.setLS("NOTFOUND", true);
  window.location.href = "./";
};

/**
 * @description
 * @param {string} structure
 */
const SPA = (structure) => {
  const functions = new Main(structure);
  window.SPA = functions;
  return functions;
};
