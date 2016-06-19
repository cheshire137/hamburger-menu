# Hamburger Menu

This is a Chrome extension that replaces the so-called "hamburger menu" icon on various websites with an actual hamburger. Because I personally think the icon of three bars looks more like three wieners, the extension has the option (and in fact it's the default!) to instead replace such icons with a hotdog. The extension also lets you right-click on any page and choose "Make this a hamburger" which will replace that element with your sandwich of choice. The extension remembers these custom hamburger overrides--hamburgerrides, if you will--and will make the replacement whenever you load the page in the future. You can go through and remove or modify your overrides on the extension's options page as well as in the extension's popup from the Chrome menu bar.

**[Install in the Chrome Web Store](https://chrome.google.com/webstore/detail/hamburger-menu/eilghennaccfpohmdffhdpckacgdaohe?hl=en)**

![Screenshot with hamburger](https://raw.githubusercontent.com/cheshire137/hamburger-menu/master/promo-assets/920x680.png)

See also the [change log](CHANGELOG.md).

## How to Use

Some icons will automatically be replaced with your choice of a hamburger or hotdog. For everything else, you can right-click and choose "Make this a hamburger," though this works best when used on images and icons.

## How to Build

1. `npm install`
2. In Chrome at `chrome://extensions/`, click 'Load unpacked extension...' and choose the extension/ directory.
