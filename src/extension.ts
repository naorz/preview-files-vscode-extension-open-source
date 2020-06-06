// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 
import * as path from 'path';
import { start } from 'repl';
 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


let hoverPanel: vscode.Hover;
let hoverStringValue: vscode.MarkdownString;
let commandUri: vscode.Uri;
let imageUrl: string|undefined;
let dis: vscode.Disposable;
let regex = /\s/g;

let previewObject: IPreviewObject = {getHtmlContent:getImageHtml, makeMrkdownString: getImageMarkdownString}

interface IPreviewObject
{
	getHtmlContent(url: string): string;
	makeMrkdownString(url: string): vscode.MarkdownString;
};

export function activate(context: vscode.ExtensionContext) {

	let editor = vscode.window.activeTextEditor;
	createNewTabCommand(context);
	imageUrl = getUrl(editor);
	hoverStringValue = new vscode.MarkdownString("", true);	
	hoverStringValue.isTrusted = true;
	if(typeof imageUrl != 'undefined')
	{
		hoverStringValue = makeMarkdownString(imageUrl);
	}
	
	if(typeof hoverPanel === 'undefined'){
		hoverPanel = new vscode.Hover(hoverStringValue);
	}
	else{
		hoverPanel.contents[0] = hoverStringValue;
	}
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.previewHover', function () {
		imageUrl = getUrl(editor);
		dis = vscode.languages.registerHoverProvider(['*'], {
				provideHover(_document: vscode.TextDocument, _position: vscode.Position, token) {
					hoverPanel.range = new vscode.Range(_position,_position);		
					return hoverPanel;}
			});		
	}));

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateHoverPanel));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateHoverPanel));	
	updateHoverPanel();
}

function createNewTabCommand(context: vscode.ExtensionContext): void
{
	const newTabCommand = 'previewHover.newTabCommand'; 

	let newTabCommandHandler = () => {
		const panel = vscode.window.createWebviewPanel(
			'preview',
			'Image preview',
			vscode.ViewColumn.Beside,
		{}	
		  );
		panel.webview.html = getWebviewContent(String(imageUrl));
	  };
	context.subscriptions.push(vscode.commands.registerCommand(newTabCommand, newTabCommandHandler));
	commandUri = vscode.Uri.parse('command:previewHover.newTabCommand');	
}

function updateHoverPanel(): void
{
	let currImageUrl = getUrl(vscode.window.activeTextEditor);
	if(currImageUrl != undefined && currImageUrl != imageUrl)
	{
		imageUrl = currImageUrl;
		hoverPanel.contents[0] = makeMarkdownString(imageUrl); 	
	}
}

function makeMarkdownString(url :string) : vscode.MarkdownString
{
	url=url.trimLeft();
	return previewObject.makeMrkdownString(url);

}

 function getUrl(editor: vscode.TextEditor | undefined): string | undefined 
 {
	 let foundUrl = {url: undefined};

	 if(editor){
		let text = editor.document.getText();
		let selStart = editor.document.offsetAt(editor.selection.anchor);
		let urlStart = getUrlStart(editor, text, selStart)
	
		extractUrlByExtension(text,selStart,urlStart,foundUrl);
		extractUrlByYouTube(text,selStart,urlStart,foundUrl);
	}
	 
	return foundUrl.url;
 }

function getWebviewContent(url: string) {

	return previewObject.getHtmlContent(url);
}

function getImageHtml(url:string): string{

	const body = `<img src="${url}"></img>`;	
	const mainHtml = `<!DOCTYPE html>
						<html lang="en">
							<head>
								<meta charset="UTF-8">
							</head>
							<body>${url ? body : '<h1 style="color: red;">NO URL</h1>'}</body>
						</html>`;

return mainHtml;
}

function getImageMarkdownString(url: string): vscode.MarkdownString
{

	hoverStringValue.value = `[Open In Browser](${url}) 
	[Open New Tab](${commandUri}) 
	![image name](${url})`;

	return hoverStringValue; 
}

function getLocalImageMarkdownString(url: string): vscode.MarkdownString
{
		if(url.indexOf("file:///") == -1) //if there is no "file:///" (and it's local) concat it to the url
		{
			url = "file:///" + url;
		}
		//local markdown is a bit different
		hoverStringValue.value = `[Open New Tab](${url}) 
		![image name](${url})`;
	
	return hoverStringValue; 
}

function getYouTubeVideoMarkdownString(url: string): vscode.MarkdownString
{
	let videoId = extractYouTubeIdFromUrl(url);
	let videoThumbnail = `https://img.youtube.com/vi/${videoId}/1.jpg` 
	hoverStringValue.value = `[Open In Browser](${url}) 
	![image name](${videoThumbnail})`;

	return hoverStringValue; 
}

function getUrlStart(editor: vscode.TextEditor |undefined, text: string, selStart: number ): number|undefined{
	let urlStart = undefined;

	if(editor)
	{
		urlStart = text.lastIndexOf('http', selStart);
		let substr = text.substring(urlStart,selStart);
		let checkWS;
		let last;

		while(checkWS = regex.exec(substr)) //get last path from substring
		{
			last = checkWS.index;
		}

		if(last)
		{
			urlStart = urlStart + last;
		}

	}
	return urlStart;
}

function extractUrlByExtension( text: string, selStart: number, urlStart:number|undefined,foundUrl: {url: string| undefined})
{

	if(typeof urlStart != 'undefined' && typeof foundUrl.url == 'undefined'){
		let imageTypeExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
		var winningExtension = '';
		var postionWhereExtensionIsFound = 999;
		imageTypeExtensions.forEach(extensionName => {
			let thisExtensionsPosition = text.indexOf(extensionName, selStart);
			if(thisExtensionsPosition > 0 && thisExtensionsPosition < postionWhereExtensionIsFound) {
				postionWhereExtensionIsFound = thisExtensionsPosition;
				winningExtension = extensionName;
			}    
		});            

		if(postionWhereExtensionIsFound !== 999) {
			previewObject.getHtmlContent = getImageHtml;
			foundUrl.url = text.slice(urlStart, postionWhereExtensionIsFound + winningExtension.length);            
			foundUrl.url=foundUrl.url.trimLeft();
			if(!foundUrl.url.match(regex))
			{
				if(foundUrl.url.includes("http"))
				{
					previewObject.makeMrkdownString = getImageMarkdownString;
				}
				else
				{
					previewObject.makeMrkdownString = getLocalImageMarkdownString;
				}
			}
			else
			{
				foundUrl.url = undefined;
			}

		}
	}
}

function extractUrlByYouTube( text: string, selStart: number, urlStart:number|undefined, foundUrl: {url: string| undefined})
{
	let urlEnd;
	let urlToValidate;

	if(urlStart && typeof foundUrl.url == 'undefined'){
		let substr = text.substring(urlStart,text.length);
		urlEnd = substr.search(regex);

		if(urlEnd != -1){
			urlToValidate = substr.substring(0,urlEnd);
		}
		else
		{
			urlToValidate=substr;
		}

		if(urlToValidate.includes("youtu")) //url may contain "youtube" or "youtu.be"
		{
			foundUrl.url = urlToValidate
			previewObject.makeMrkdownString = getYouTubeVideoMarkdownString;
		}
		
	}
}

function extractYouTubeIdFromUrl(url: string ): string | undefined
{
	let urlId = undefined;
	let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	let match = url.match(regExp);
	if(match)
	{
		urlId = match[7].toString();
	}
    return urlId;
}