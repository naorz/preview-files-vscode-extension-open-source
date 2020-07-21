

const languages = {
    createDiagnosticCollection: jest.fn()
  };

  const MarkdownString = {
   
  };
  const ExtensionContext = {

  };
  
  const StatusBarAlignment = {};
  
  const window = {
    createStatusBarItem: jest.fn(() => ({
      show: jest.fn()
    })),
    showErrorMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    createTextEditorDecorationType: jest.fn()
  };
  
  const workspace = {
    getConfiguration: jest.fn(),
    workspaceFolders: [],
    onDidSaveTextDocument: jest.fn()
  };
  
  const OverviewRulerLane = {
    Left: null
  };
  
  const Uri = {
    file: (f: any) => f,
    parse: jest.fn()
  };
  const Range = jest.fn();
  const Diagnostic = jest.fn();
  const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 };
  
  const debug = {
    onDidTerminateDebugSession: jest.fn(),
    startDebugging: jest.fn()
  };
  
  const commands = {
    executeCommand: jest.fn()
  };
  
  const vscode = {
    languages,
    StatusBarAlignment,
    window,
    workspace,
    OverviewRulerLane,
    Uri,
    MarkdownString,
    ExtensionContext,
    Range,
    Diagnostic,
    DiagnosticSeverity,
    debug,
    commands
  };
  
  module.exports = vscode;