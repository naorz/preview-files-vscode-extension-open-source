import cssObject from './cssObject';
//import {Uri, MarkdownString, commands, ExtensionContext} from 'vscode';
import * as utils from './utils';
import ValidateObject from './validationObject';


describe('cssObject', () => {	
	it('Sample test', () => {
		const mockFn = jest.fn()
		utils.variablesUtils.validateObject = new ValidateObject();
		jest.spyOn(utils.variablesUtils.validateObject,'addValidateFunction').mockImplementation(() => {})
		const instance = new cssObject();
		expect(utils.variablesUtils.validateObject.addValidateFunction).toHaveBeenCalledWith('css',instance.validatePotentialUrl);
	});
});