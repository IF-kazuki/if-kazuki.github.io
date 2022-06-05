<h1 align="center">SPAjs !!</h1>

## Quick Start index.html

```html
<html>
  <head>
    <script src="https://if-kazuki.github.io/spa.js"></script>
  </head>

  <body>
    <div id="root"></div>

    <script>
      const { Link, Import, Cacher, DevMode } = SPA({
        header: {
          "/": "header.html",
        },
        main: {
          "/": "index.html",
          "/doc": "doc.html",
        },
        footer: {
          "/": "footer.html",
        },
      });
    </script>
  </body>
</html>
```

### directory structure

- .index.html
- header/
  - .header.html
- main/
  - .index.html
  - .doc.html
- footer/
  - .footer.html

## documentation

the explanation is written on my [site.](https://if-kazuki.github.io)
