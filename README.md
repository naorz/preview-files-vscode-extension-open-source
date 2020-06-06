# Preview Files README

This is our computer science Bachelor degree final project.
We developed an extension for visual studio code that currently previews images and youtube videos.
We made our project an open source for other people to try and expand our extension to similar features (Pdf files, office file etc.)

## Features

This extension currently supports:

+ Non local images (URLs that begins with 'http' and ends with one of: 'png', 'jpg', 'jpeg', 'gif', 'bmp')
  
  * View image in a new tab inside the vscode.
  * View image in browser.
  * Image preview when hovering.
  
+ Local images (only explicit path)

  * View image in a new tab.
  * Image preview when hovering.
  
+ YouTube videos (youtube URLs)

  * Open video in browser.
  * Video thumbnail preview when hovering.
  
  
![image](youtube-video-gif.gif)

![image](images-working-gif.gif)


## Extension Settings

We registered the following commands (in package.json file):

```json
"commands": [
			{
				"command": "extension.previewHover",
				"title": "Preview Hover"
			},
			{
				"command": "previewHover.newTabCommand",
				"title": "newTabCommand"
			}
		
]
```
Preview Hover is called to activate the extension.

newTabCommand is only called from inside the extension whenever a new tab must be displayed.


## Known Issues

All issues and solutions are documented in [our blog](https://vscodeextensiondev.blogspot.com/)
