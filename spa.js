/**
 * k  k     a    zzzzz  u   u  k  k   i
 * k k     a a      z   u   u  k k    i
 * kkk    aaaaa    z    u   u  kkk    i
 * k  k   a   a   z     u   u  k  k   i
 * k   k  a   a  zzzzz   uuu   k   k  i
 */

/**
 * @description get the dom tag
 * @param {string} target
 * @returns dom element
 */
const devGetTag = (target) => {
  const element = document.getElementsByTagName(target)[0];
  return element;
};

/**
 * @description get the dom id
 * @param {string} target
 * @returns dom element
 */
const devGetId = (target) => {
  const element = document.getElementById(target);
  return element;
};

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
    const root = document.getElementsByTagName(target)[0];
    root.innerHTML = "";

    /** text style tag insert */
    const element = (tag) => {
      const element = doc.activeElement.getElementsByTagName(tag)[0];
      return element;
    };

    let allElement = "";
    if (element("text")) {
      allElement += element("text").innerHTML;
    } else {
      throw new Error(`missing text tag at ${target}`);
    }
    if (element("style")) {
      allElement += `<style>${element("style").innerText}</style>`;
    }

    devGetTag(target).innerHTML = allElement;

    /** script tag insert */
    if (element("script")) {
      const script = document.createElement("script");
      script.innerHTML = element("script").innerText;

      devGetTag(target).appendChild(script);
    }
  });
};

/**
 * @description
 * get the URL structure adn apply the script according to the structure
 * @param {string} baseUrl
 * @param {*} URLstructure
 * @returns
 * Link
 *  - providers the ability to swap DOM elements
 */
const SPA = class {
  constructor(baseUrl, URLstructure) {
    /** start massege */
    console.log("start spa !!");

    /** parent DOM generetion */
    const key = Object.keys(URLstructure);

    for (let i = 0; i < key.length; i++) {
      const dom = document.createElement(key[i]);
      devGetId("root").append(dom);
    }

    /**
     * @description create a script for each structure
     * @param {string} target
     */
    const router = (target) => {
      const value = Object.values(URLstructure);
      const params = location.pathname;

      for (let i = 0; i < value.length; i++) {
        if (URLstructure[target]) {
          setDOM(
            `${baseUrl}/${target}/${URLstructure[target][params]}`,
            target
          );
          break;
        }

        if (value[i][params]) {
          setDOM(`${baseUrl}/${key[i]}/${value[i][params]}`, key[i]);
        }
      }
    };

    /**
     * @description switch DOM
     * @param {string} id
     */
    const Link = (id, target) => {
      const a = devGetId(id);

      a.onclick = () => {
        history.replaceState("", "", `${a.id}`);

        router(target);
      };
    };

    /** initial rendering */
    router();
    return { Link };
  }
};

/**
 * @description
 */
const NotFound = () => {
  window.location.href = `./`;
};
