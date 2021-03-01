Snippets.SnippetStorage=class extends Common.Object{constructor(settingPrefix,namePrefix){super();this._snippets=new Map();this._lastSnippetIdentifierSetting=Common.settings.createSetting(settingPrefix+'Snippets_lastIdentifier',0);this._snippetsSetting=Common.settings.createSetting(settingPrefix+'Snippets',[]);this._namePrefix=namePrefix;this._loadSettings();}
get namePrefix(){return this._namePrefix;}
_saveSettings(){const savedSnippets=[];for(const snippet of this._snippets.values())
savedSnippets.push(snippet.serializeToObject());this._snippetsSetting.set(savedSnippets);}
snippets(){return this._snippets.valuesArray();}
snippetForId(id){return this._snippets.get(id);}
snippetForName(name){for(const snippet of this._snippets.values()){if(snippet.name===name)
return snippet;}
return null;}
_loadSettings(){const savedSnippets=this._snippetsSetting.get();for(let i=0;i<savedSnippets.length;++i)
this._snippetAdded(Snippets.Snippet.fromObject(this,savedSnippets[i]));}
deleteSnippet(snippet){this._snippets.delete(snippet.id);this._saveSettings();}
createSnippet(){const nextId=this._lastSnippetIdentifierSetting.get()+1;const snippetId=String(nextId);this._lastSnippetIdentifierSetting.set(nextId);const snippet=new Snippets.Snippet(this,snippetId);this._snippetAdded(snippet);this._saveSettings();return snippet;}
_snippetAdded(snippet){this._snippets.set(snippet.id,snippet);}};Snippets.Snippet=class extends Common.Object{constructor(storage,id,name,content){super();this._storage=storage;this._id=id;this._name=name||storage.namePrefix+id;this._content=content||'';}
static fromObject(storage,serializedSnippet){return new Snippets.Snippet(storage,serializedSnippet.id,serializedSnippet.name,serializedSnippet.content);}
get id(){return this._id;}
get name(){return this._name;}
set name(name){if(this._name===name)
return;this._name=name;this._storage._saveSettings();}
get content(){return this._content;}
set content(content){if(this._content===content)
return;this._content=content;this._storage._saveSettings();}
serializeToObject(){const serializedSnippet={};serializedSnippet.id=this.id;serializedSnippet.name=this.name;serializedSnippet.content=this.content;return serializedSnippet;}};;Snippets.ScriptSnippetModel=class extends Common.Object{constructor(workspace){super();this._workspace=workspace;this._uiSourceCodeForSnippetId={};this._snippetIdForUISourceCode=new Map();this._mappingForDebuggerModel=new Map();this._snippetStorage=new Snippets.SnippetStorage('script','Script snippet #');this._lastSnippetEvaluationIndexSetting=Common.settings.createSetting('lastSnippetEvaluationIndex',0);this._project=new Snippets.SnippetsProject(workspace,this);this._loadSnippets();SDK.targetManager.observeModels(SDK.DebuggerModel,this);Bindings.debuggerWorkspaceBinding.addSourceMapping(this);}
modelAdded(debuggerModel){this._mappingForDebuggerModel.set(debuggerModel,new Snippets.SnippetScriptMapping(debuggerModel,this));}
modelRemoved(debuggerModel){this._mappingForDebuggerModel.remove(debuggerModel);}
rawLocationToUILocation(rawLocation){const mapping=this._mappingForDebuggerModel.get(rawLocation.debuggerModel);if(!mapping)
return null;return mapping.rawLocationToUILocation(rawLocation);}
uiLocationToRawLocation(uiSourceCode,lineNumber,columnNumber){for(const mapping of this._mappingForDebuggerModel.values()){const rawLocation=mapping.uiLocationToRawLocation(uiSourceCode,lineNumber,columnNumber);if(rawLocation)
return rawLocation;}
return null;}
snippetScriptMapping(debuggerModel){return this._mappingForDebuggerModel.get(debuggerModel);}
project(){return this._project;}
_loadSnippets(){for(const snippet of this._snippetStorage.snippets())
this._addScriptSnippet(snippet);}
createScriptSnippet(content){const snippet=this._snippetStorage.createSnippet();snippet.content=content;return this._addScriptSnippet(snippet);}
_addScriptSnippet(snippet){const uiSourceCode=this._project.addSnippet(snippet.name,new Snippets.SnippetContentProvider(snippet));uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged,this._workingCopyChanged,this);this._snippetIdForUISourceCode.set(uiSourceCode,snippet.id);const breakpointLocations=this._removeBreakpoints(uiSourceCode);this._restoreBreakpoints(uiSourceCode,breakpointLocations);this._uiSourceCodeForSnippetId[snippet.id]=uiSourceCode;return uiSourceCode;}
_workingCopyChanged(event){const uiSourceCode=(event.data);this._scriptSnippetEdited(uiSourceCode);}
deleteScriptSnippet(uiSourceCode){const snippetId=this._snippetIdForUISourceCode.get(uiSourceCode)||'';const snippet=this._snippetStorage.snippetForId(snippetId);if(!snippet)
return;this._snippetStorage.deleteSnippet(snippet);this._removeBreakpoints(uiSourceCode);this._releaseSnippetScript(uiSourceCode);delete this._uiSourceCodeForSnippetId[snippet.id];this._snippetIdForUISourceCode.remove(uiSourceCode);this._project.removeFile(snippet.name);}
renameScriptSnippet(name,newName,callback){newName=newName.trim();if(!newName||newName.indexOf('/')!==-1||name===newName||this._snippetStorage.snippetForName(newName)){callback(false);return;}
const snippet=this._snippetStorage.snippetForName(name);console.assert(snippet,'Snippet \''+name+'\' was not found.');const uiSourceCode=this._uiSourceCodeForSnippetId[snippet.id];console.assert(uiSourceCode,'No uiSourceCode was found for snippet \''+name+'\'.');const breakpointLocations=this._removeBreakpoints(uiSourceCode);snippet.name=newName;this._restoreBreakpoints(uiSourceCode,breakpointLocations);callback(true,newName);}
_setScriptSnippetContent(name,newContent){const snippet=this._snippetStorage.snippetForName(name);snippet.content=newContent;}
_scriptSnippetEdited(uiSourceCode){const breakpointLocations=this._removeBreakpoints(uiSourceCode);this._releaseSnippetScript(uiSourceCode);this._restoreBreakpoints(uiSourceCode,breakpointLocations);this._mappingForDebuggerModel.valuesArray().forEach(function(mapping){mapping._restoreBreakpoints(uiSourceCode,breakpointLocations);});}
_nextEvaluationIndex(){const evaluationIndex=this._lastSnippetEvaluationIndexSetting.get()+1;this._lastSnippetEvaluationIndexSetting.set(evaluationIndex);return evaluationIndex;}
async evaluateScriptSnippet(executionContext,uiSourceCode){console.assert(uiSourceCode.project().type()===Workspace.projectTypes.Snippets);let breakpointLocations=this._removeBreakpoints(uiSourceCode);this._releaseSnippetScript(uiSourceCode);this._restoreBreakpoints(uiSourceCode,breakpointLocations);const runtimeModel=executionContext.runtimeModel;const debuggerModel=executionContext.debuggerModel;const evaluationIndex=this._nextEvaluationIndex();const mapping=this._mappingForDebuggerModel.get(debuggerModel);mapping._setEvaluationIndex(evaluationIndex,uiSourceCode);const evaluationUrl=mapping._evaluationSourceURL(uiSourceCode);await uiSourceCode.requestContent();const expression=uiSourceCode.workingCopy();Common.console.show();const result=await runtimeModel.compileScript(expression,'',true,executionContext.id);if(!result||mapping.evaluationIndex(uiSourceCode)!==evaluationIndex)
return;const script=(debuggerModel.scriptForId((result.scriptId||result.exceptionDetails.scriptId)));mapping._addScript(script,uiSourceCode);if(!result.scriptId){this._printRunOrCompileScriptResultFailure(runtimeModel,(result.exceptionDetails),evaluationUrl);return;}
breakpointLocations=this._removeBreakpoints(uiSourceCode);this._restoreBreakpoints(uiSourceCode,breakpointLocations);this._runScript(script.scriptId,executionContext,evaluationUrl);}
async _runScript(scriptId,executionContext,sourceURL){const runtimeModel=executionContext.runtimeModel;const result=await runtimeModel.runScript(scriptId,executionContext.id,'console',false,true,false,true);if(result.error)
return;if(!result.exceptionDetails)
this._printRunScriptResult(runtimeModel,result.object||null,scriptId,sourceURL);else
this._printRunOrCompileScriptResultFailure(runtimeModel,result.exceptionDetails,sourceURL);}
_printRunScriptResult(runtimeModel,result,scriptId,sourceURL){const consoleMessage=new SDK.ConsoleMessage(runtimeModel,SDK.ConsoleMessage.MessageSource.JS,SDK.ConsoleMessage.MessageLevel.Info,'',SDK.ConsoleMessage.MessageType.Result,sourceURL,undefined,undefined,[result],undefined,undefined,undefined,scriptId);SDK.consoleModel.addMessage(consoleMessage);}
_printRunOrCompileScriptResultFailure(runtimeModel,exceptionDetails,sourceURL){SDK.consoleModel.addMessage(SDK.ConsoleMessage.fromException(runtimeModel,exceptionDetails,undefined,undefined,sourceURL||undefined));}
_removeBreakpoints(uiSourceCode){const breakpointLocations=Bindings.breakpointManager.breakpointLocationsForUISourceCode(uiSourceCode);for(let i=0;i<breakpointLocations.length;++i)
breakpointLocations[i].breakpoint.remove(false);return breakpointLocations;}
_restoreBreakpoints(uiSourceCode,breakpointLocations){for(let i=0;i<breakpointLocations.length;++i){const uiLocation=breakpointLocations[i].uiLocation;const breakpoint=breakpointLocations[i].breakpoint;Bindings.breakpointManager.setBreakpoint(uiSourceCode,uiLocation.lineNumber,uiLocation.columnNumber,breakpoint.condition(),breakpoint.enabled());}}
_releaseSnippetScript(uiSourceCode){this._mappingForDebuggerModel.valuesArray().forEach(function(mapping){mapping._releaseSnippetScript(uiSourceCode);});}
_snippetIdForSourceURL(sourceURL){const snippetPrefix=Snippets.ScriptSnippetModel.snippetSourceURLPrefix;if(!sourceURL.startsWith(snippetPrefix))
return null;const splitURL=sourceURL.substring(snippetPrefix.length).split('_');const snippetId=splitURL[0];return snippetId;}};Snippets.ScriptSnippetModel.snippetSourceURLPrefix='snippets:///';Snippets.SnippetScriptMapping=class{constructor(debuggerModel,scriptSnippetModel){this._debuggerModel=debuggerModel;this._scriptSnippetModel=scriptSnippetModel;this._uiSourceCodeForScriptId={};this._scriptForUISourceCode=new Map();this._evaluationIndexForUISourceCode=new Map();debuggerModel.addEventListener(SDK.DebuggerModel.Events.GlobalObjectCleared,this._reset,this);}
_releaseSnippetScript(uiSourceCode){const script=this._scriptForUISourceCode.get(uiSourceCode);if(!script)
return;delete this._uiSourceCodeForScriptId[script.scriptId];this._scriptForUISourceCode.remove(uiSourceCode);this._evaluationIndexForUISourceCode.remove(uiSourceCode);}
_setEvaluationIndex(evaluationIndex,uiSourceCode){this._evaluationIndexForUISourceCode.set(uiSourceCode,evaluationIndex);}
evaluationIndex(uiSourceCode){return this._evaluationIndexForUISourceCode.get(uiSourceCode);}
_evaluationSourceURL(uiSourceCode){const evaluationSuffix='_'+this._evaluationIndexForUISourceCode.get(uiSourceCode);const snippetId=this._scriptSnippetModel._snippetIdForUISourceCode.get(uiSourceCode);return Snippets.ScriptSnippetModel.snippetSourceURLPrefix+snippetId+evaluationSuffix;}
_reset(){this._uiSourceCodeForScriptId={};this._scriptForUISourceCode.clear();this._evaluationIndexForUISourceCode.clear();}
rawLocationToUILocation(rawLocation){const debuggerModelLocation=(rawLocation);const uiSourceCode=this._uiSourceCodeForScriptId[debuggerModelLocation.scriptId];if(!uiSourceCode)
return null;return uiSourceCode.uiLocation(debuggerModelLocation.lineNumber,debuggerModelLocation.columnNumber||0);}
uiLocationToRawLocation(uiSourceCode,lineNumber,columnNumber){const script=this._scriptForUISourceCode.get(uiSourceCode);if(!script)
return null;return this._debuggerModel.createRawLocation(script,lineNumber,columnNumber);}
_addScript(script,uiSourceCode){console.assert(!this._scriptForUISourceCode.get(uiSourceCode));this._uiSourceCodeForScriptId[script.scriptId]=uiSourceCode;this._scriptForUISourceCode.set(uiSourceCode,script);Bindings.debuggerWorkspaceBinding.updateLocations(script);}
_restoreBreakpoints(uiSourceCode,breakpointLocations){const script=this._scriptForUISourceCode.get(uiSourceCode);if(!script)
return;const rawLocation=(this._debuggerModel.createRawLocation(script,0,0));const uiLocation=Bindings.debuggerWorkspaceBinding.rawLocationToUILocation(rawLocation);if(uiLocation)
this._scriptSnippetModel._restoreBreakpoints(uiLocation.uiSourceCode,breakpointLocations);}};Snippets.SnippetContentProvider=class{constructor(snippet){this._snippet=snippet;}
contentURL(){return'';}
contentType(){return Common.resourceTypes.Snippet;}
contentEncoded(){return Promise.resolve(false);}
requestContent(){return Promise.resolve((this._snippet.content));}
async searchInContent(query,caseSensitive,isRegex){return Common.ContentProvider.performSearchInContent(this._snippet.content,query,caseSensitive,isRegex);}};Snippets.SnippetsProject=class extends Bindings.ContentProviderBasedProject{constructor(workspace,model){super(workspace,'snippets:',Workspace.projectTypes.Snippets,'',false);this._model=model;}
addSnippet(name,contentProvider){return this.addContentProvider(name,contentProvider,'text/javascript');}
canSetFileContent(){return true;}
setFileContent(uiSourceCode,newContent,isBase64,callback){this._model._setScriptSnippetContent(uiSourceCode.url(),newContent);callback('');}
canRename(){return true;}
performRename(url,newName,callback){this._model.renameScriptSnippet(url,newName,callback);}
createFile(url,name,content,isBase64){return(Promise.resolve(this._model.createScriptSnippet(content)));}
deleteFile(uiSourceCode){this._model.deleteScriptSnippet(uiSourceCode);}};Snippets.scriptSnippetModel=new Snippets.ScriptSnippetModel(Workspace.workspace);;Snippets.SnippetsQuickOpen=class extends QuickOpen.FilteredListWidget.Provider{constructor(){super();this._snippets=[];}
selectItem(itemIndex,promptValue){if(itemIndex===null)
return;const currentExecutionContext=UI.context.flavor(SDK.ExecutionContext);if(currentExecutionContext)
Snippets.scriptSnippetModel.evaluateScriptSnippet(currentExecutionContext,this._snippets[itemIndex]);}
notFoundText(query){return Common.UIString('No snippets found.');}
attach(){this._snippets=Snippets.scriptSnippetModel.project().uiSourceCodes();}
detach(){this._snippets=[];}
itemCount(){return this._snippets.length;}
itemKeyAt(itemIndex){return this._snippets[itemIndex].name();}
renderItem(itemIndex,query,titleElement,subtitleElement){titleElement.textContent=this._snippets[itemIndex].name();titleElement.classList.add('monospace');QuickOpen.FilteredListWidget.highlightRanges(titleElement,query,true);}};;