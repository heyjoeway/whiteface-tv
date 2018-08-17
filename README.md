# whiteface-tv

## Dependencies

- git
- Some sort of web server

## Instructions

1. Go to folder where you want to host this site.
2. ```git clone https://github.com/Joseph14078/whiteface-tv```
3. ```cd whiteface-tv```
4. ```chmod -R u+rwx,g-rwx,o-rwx .git```

### Browser CSS

Some embedded sites may look wrong without custom CSS for them. To fix this:

1. Install [Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) (or a similar custom CSS extension).
2. Click on the new Stylus button in the toolbar and then click "Manage".
3. For each of the files in the "browsercss" folder of this repository:
    1. Select "Write New Style" in Stylus.
    2. Paste the contents of the file into the large "Code" box.
    3. Below the "Code" box, there should be something that says "Applies to Everything" with a plus symbol next to it. Click the plus symbol.
    4. Change "URL" to "URLs on the domain".
    5. In the box next to that, paste the filename WITHOUT the ".css" at the end.
        - e.g. If the filename is "nysmesonet.org.css" you should only paste "nysmesonet.org" (without the quotes).
    6. In the top left, name the style whatever you'd like and click save.

## Note

If some images don't show up, make sure they are hosted on the same server as this site.
For more information, read up on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

## License

MIT
