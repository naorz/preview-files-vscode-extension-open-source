export default class ValidateObject{

	private validateFunctionArray: {[id: string]: ((foundUrl: {url: string| undefined})=> void) } = {};

	invokeValidationFunctions(foundUrl: {url: string| undefined})
	{
		let validationFunction;
		for (let key in this.validateFunctionArray) {
			validationFunction = this.validateFunctionArray[key];
			validationFunction(foundUrl); 
		}
	}

	addValidateFunction(functionId: string, func :(foundUrl: {url: string| undefined}) => void) :void
	{
		this.validateFunctionArray[functionId] = func;
	}

	removeValidateFunction(functionId: string) :void
	{
		delete this.validateFunctionArray[functionId];
	}
}