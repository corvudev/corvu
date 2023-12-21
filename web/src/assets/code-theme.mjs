var corvu = {
  name: 'corvu',
  type: 'dark',
  colors: {
    'activityBar.background': '#1b1e28',
    'activityBar.foreground': '#a6accd',
    'activityBarBadge.background': '#303340',
    'activityBarBadge.foreground': '#e4f0fb',
    'badge.background': '#303340',
    'badge.foreground': '#e4f0fb',
    'button.background': '#303340',
    'diffEditor.insertedTextBackground': '#50647715',
    'diffEditor.removedTextBackground': '#d0679d20',
    'dropdown.background': '#1b1e28',
    'dropdown.border': '#ffffff10',
    'editor.background': '#0C0812',
    'editor.findMatchBackground': '#ADD7FF40',
    'editor.findMatchBorder': '#ADD7FF',
    'editor.findMatchHighlightBackground': '#ADD7FF40',
    'editor.foreground': '#a6accd',
    'editor.lineHighlightBackground': '#717cb425',
    'editor.lineHighlightBorder': '#00000000',
    'editor.selectionBackground': '#717cb425',
    'editor.selectionHighlightBackground': '#00000000',
    'editor.selectionHighlightBorder': '#ADD7FF80',
    'editor.wordHighlightBackground': '#ADD7FF20',
    'editor.wordHighlightStrongBackground': '#ADD7FF40',
    'editorBracketMatch.border': '#e4f0fb40',
    'editorCursor.foreground': '#a6accd',
    'editorGroup.border': '#00000030',
    'editorGroupHeader.tabsBackground': '#1b1e28',
    'editorHoverWidget.background': '#1b1e28',
    'editorHoverWidget.border': '#ffffff10',
    'editorIndentGuide.background': '#303340',
    'editorLineNumber.foreground': '#767c9d50',
    'editorLink.activeForeground': '#ADD7FF',
    'editorSuggestWidget.background': '#1b1e28',
    'editorSuggestWidget.border': '#ffffff10',
    'editorSuggestWidget.foreground': '#a6accd',
    'editorSuggestWidget.highlightForeground': '#A888F1',
    'editorSuggestWidget.selectedBackground': '#00000050',
    'editorWidget.background': '#1b1e28',
    'editor.findRangeHighlightBackground': '#ADD7FF40',
    'editor.focusedStackFrameHighlightBackground': '#7abd7a4d',
    'editor.foldBackground': '#717cb40b',
    'editor.hoverHighlightBackground': '#264f7840',
    'editor.inactiveSelectionBackground': '#717cb425',
    'editor.linkedEditingBackground': '#d0679d4d',
    'editor.rangeHighlightBackground': '#ffffff0b',
    'editor.snippetFinalTabstopHighlightBorder': '#525252',
    'editor.snippetTabstopHighlightBackground': '#7c7c7c4d',
    'editor.stackFrameHighlightBackground': '#ffff0033',
    'editor.symbolHighlightBackground': '#89ddff60',
    'editorBracketMatch.background': '#00000000',
    'editorCodeLens.foreground': '#a6accd',
    'editorError.foreground': '#d0679d',
    'editorGroup.dropBackground': '#7390AA80',
    'editorGroupHeader.noTabsBackground': '#1b1e28',
    'editorGutter.background': '#1b1e28',
    'editorGutter.commentRangeForeground': '#a6accd',
    'editorGutter.foldingControlForeground': '#a6accd',
    'editorGutter.addedBackground': '#5fb3a140',
    'editorGutter.deletedBackground': '#d0679d40',
    'editorGutter.modifiedBackground': '#ADD7FF20',
    'editorHint.foreground': '#7390AAb3',
    'editorHoverWidget.foreground': '#a6accd',
    'editorHoverWidget.statusBarBackground': '#202430',
    'editorIndentGuide.activeBackground': '#e3e4e229',
    'editorInfo.foreground': '#ADD7FF',
    'editorInlineHint.background': '#a6accd',
    'editorInlineHint.foreground': '#1b1e28',
    'editorLightBulb.foreground': '#fffac2',
    'editorLightBulbAutoFix.foreground': '#ADD7FF',
    'editorLineNumber.activeForeground': '#a6accd',
    'editorMarkerNavigation.background': '#2d2d30',
    'editorMarkerNavigationError.background': '#d0679d',
    'editorMarkerNavigationInfo.background': '#ADD7FF',
    'editorMarkerNavigationWarning.background': '#fffac2',
    'editorOverviewRuler.addedForeground': '#5fb3a199',
    'editorOverviewRuler.border': '#00000000',
    'editorOverviewRuler.bracketMatchForeground': '#a0a0a0',
    'editorOverviewRuler.commonContentForeground': '#a6accd66',
    'editorOverviewRuler.currentContentForeground': '#5fb3a180',
    'editorOverviewRuler.deletedForeground': '#d0679d99',
    'editorOverviewRuler.errorForeground': '#d0679db3',
    'editorOverviewRuler.findMatchForeground': '#e4f0fb20',
    'editorOverviewRuler.incomingContentForeground': '#89ddff80',
    'editorOverviewRuler.infoForeground': '#ADD7FF',
    'editorOverviewRuler.modifiedForeground': '#89ddff99',
    'editorOverviewRuler.rangeHighlightForeground': '#89ddff99',
    'editorOverviewRuler.selectionHighlightForeground': '#a0a0a0cc',
    'editorOverviewRuler.warningForeground': '#fffac2',
    'editorOverviewRuler.wordHighlightForeground': '#a0a0a0cc',
    'editorOverviewRuler.wordHighlightStrongForeground': '#89ddffcc',
    'editorPane.background': '#1b1e28',
    'editorRuler.foreground': '#e4f0fb10',
    'editorUnnecessaryCode.opacity': '#000000aa',
    'editorWarning.foreground': '#fffac2',
    'editorWhitespace.foreground': '#303340',
    'editorWidget.border': '#a6accd',
    'editorWidget.foreground': '#a6accd',
    'extensionButton.prominentBackground': '#30334090',
    'extensionButton.prominentHoverBackground': '#303340',
    focusBorder: '#00000000',
    'input.background': '#ffffff05',
    'input.border': '#ffffff10',
    'input.foreground': '#e4f0fb',
    'input.placeholderForeground': '#a6accd60',
    'inputValidation.errorBorder': '#d0679d',
    'inputValidation.errorForeground': '#d0679d',
    'inputValidation.infoBorder': '#89ddff',
    'inputValidation.warningBorder': '#fffac2',
    'notifications.background': '#1b1e28',
    'notifications.foreground': '#e4f0fb',
    'panel.border': '#00000030',
    'panelTitle.activeForeground': '#a6accd',
    'peekView.border': '#00000030',
    'peekViewEditor.background': '#a6accd05',
    'peekViewEditorGutter.background': '#a6accd05',
    'peekViewResult.background': '#a6accd05',
    'peekViewTitle.background': '#a6accd05',
    'peekViewTitleDescription.foreground': '#a6accd60',
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.activeBackground': '#a6accd25',
    'scrollbarSlider.background': '#00000080',
    'scrollbarSlider.hoverBackground': '#a6accd25',
    'selection.background': '#a6accd',
    'sideBar.background': '#1b1e28',
    'sideBar.foreground': '#767c9d',
    'sideBarSectionHeader.background': '#1b1e28',
    'sideBarTitle.foreground': '#a6accd',
    'statusBar.background': '#1b1e28',
    'statusBar.foreground': '#a6accd',
    'statusBar.noFolderBackground': '#1b1e28',
    'tab.activeBackground': '#30334080',
    'tab.activeForeground': '#e4f0fb',
    'tab.border': '#00000000',
    'tab.inactiveBackground': '#1b1e28',
    'tab.inactiveForeground': '#767c9d',
    'tab.unfocusedActiveForeground': '#a6accd',
    'tab.activeModifiedBorder': '#ADD7FF',
    'tab.inactiveModifiedBorder': '#ADD7FF80',
    'tab.lastPinnedBorder': '#00000000',
    'tab.unfocusedActiveBackground': '#1b1e28',
    'tab.unfocusedActiveModifiedBorder': '#ADD7FF40',
    'tab.unfocusedInactiveBackground': '#1b1e28',
    'tab.unfocusedInactiveForeground': '#a6accd80',
    'tab.unfocusedInactiveModifiedBorder': '#ADD7FF40',
    'terminal.ansiBlack': '#1b1e28',
    'terminal.ansiBlue': '#89ddff',
    'terminal.ansiBrightBlack': '#a6accd',
    'terminal.ansiBrightBlue': '#ADD7FF',
    'terminal.ansiBrightCyan': '#ADD7FF',
    'terminal.ansiBrightGreen': '#A888F1',
    'terminal.ansiBrightMagenta': '#f087bd',
    'terminal.ansiBrightRed': '#d0679d',
    'terminal.ansiBrightWhite': '#ffffff',
    'terminal.ansiBrightYellow': '#fffac2',
    'terminal.ansiCyan': '#89ddff',
    'terminal.ansiGreen': '#A888F1',
    'terminal.ansiMagenta': '#f087bd',
    'terminal.ansiRed': '#d0679d',
    'terminal.ansiWhite': '#ffffff',
    'terminal.ansiYellow': '#fffac2',
    'textLink.activeForeground': '#ADD7FF',
    'textLink.foreground': '#ADD7FF',
    'titleBar.activeBackground': '#1b1e28',
    'titleBar.activeForeground': '#a6accd',
    'titleBar.inactiveBackground': '#1b1e28',
    'titleBar.inactiveForeground': '#767c9d',
    'tree.indentGuidesStroke': '#303340',
    'widget.shadow': '#00000030',
    'activityBar.activeBorder': '#a6accd',
    'activityBar.dropBorder': '#a6accd',
    'activityBar.inactiveForeground': '#a6accd66',
    'breadcrumb.activeSelectionForeground': '#e4f0fb',
    'breadcrumb.background': '#00000000',
    'breadcrumb.focusForeground': '#e4f0fb',
    'breadcrumb.foreground': '#767c9dcc',
    'breadcrumbPicker.background': '#1b1e28',
    'button.foreground': '#ffffff',
    'button.hoverBackground': '#50647750',
    'button.secondaryBackground': '#a6accd',
    'button.secondaryForeground': '#ffffff',
    'button.secondaryHoverBackground': '#a6accd',
    'charts.blue': '#ADD7FF',
    'charts.foreground': '#a6accd',
    'charts.green': '#A888F1',
    'charts.lines': '#a6accd80',
    'charts.orange': '#89ddff',
    'charts.purple': '#f087bd',
    'charts.red': '#d0679d',
    'charts.yellow': '#fffac2',
    'checkbox.background': '#1b1e28',
    'checkbox.border': '#ffffff10',
    'checkbox.foreground': '#e4f0fb',
    'debugConsole.errorForeground': '#d0679d',
    'debugConsole.infoForeground': '#ADD7FF',
    'debugConsole.sourceForeground': '#a6accd',
    'debugConsole.warningForeground': '#fffac2',
    'debugConsoleInputIcon.foreground': '#a6accd',
    'debugExceptionWidget.background': '#d0679d',
    'debugExceptionWidget.border': '#d0679d',
    'debugIcon.breakpointCurrentStackframeForeground': '#fffac2',
    'debugIcon.breakpointDisabledForeground': '#7390AA',
    'debugIcon.breakpointForeground': '#d0679d',
    'debugIcon.breakpointStackframeForeground': '#5fb3a1',
    'debugIcon.breakpointUnverifiedForeground': '#7390AA',
    'debugIcon.continueForeground': '#ADD7FF',
    'debugIcon.disconnectForeground': '#d0679d',
    'debugIcon.pauseForeground': '#ADD7FF',
    'debugIcon.restartForeground': '#5fb3a1',
    'debugIcon.startForeground': '#5fb3a1',
    'debugIcon.stepBackForeground': '#ADD7FF',
    'debugIcon.stepIntoForeground': '#ADD7FF',
    'debugIcon.stepOutForeground': '#ADD7FF',
    'debugIcon.stepOverForeground': '#ADD7FF',
    'debugIcon.stopForeground': '#d0679d',
    'debugTokenExpression.boolean': '#89ddff',
    'debugTokenExpression.error': '#d0679d',
    'debugTokenExpression.name': '#e4f0fb',
    'debugTokenExpression.number': '#5fb3a1',
    'debugTokenExpression.string': '#89ddff',
    'debugTokenExpression.value': '#a6accd99',
    'debugToolBar.background': '#303340',
    'debugView.exceptionLabelBackground': '#d0679d',
    'debugView.exceptionLabelForeground': '#e4f0fb',
    'debugView.stateLabelBackground': '#303340',
    'debugView.stateLabelForeground': '#a6accd',
    'debugView.valueChangedHighlight': '#89ddff',
    descriptionForeground: '#a6accdb3',
    'diffEditor.diagonalFill': '#a6accd33',
    'dropdown.foreground': '#e4f0fb',
    errorForeground: '#d0679d',
    'extensionBadge.remoteBackground': '#303340',
    'extensionBadge.remoteForeground': '#e4f0fb',
    'extensionButton.prominentForeground': '#ffffff',
    'extensionIcon.starForeground': '#fffac2',
    foreground: '#a6accd',
    'gitDecoration.addedResourceForeground': '#5fb3a1',
    'gitDecoration.conflictingResourceForeground': '#d0679d',
    'gitDecoration.deletedResourceForeground': '#d0679d',
    'gitDecoration.ignoredResourceForeground': '#767c9d70',
    'gitDecoration.modifiedResourceForeground': '#ADD7FF',
    'gitDecoration.renamedResourceForeground': '#A888F1',
    'gitDecoration.stageDeletedResourceForeground': '#d0679d',
    'gitDecoration.stageModifiedResourceForeground': '#ADD7FF',
    'gitDecoration.submoduleResourceForeground': '#89ddff',
    'gitDecoration.untrackedResourceForeground': '#A888F1',
    'icon.foreground': '#a6accd',
    'imagePreview.border': '#303340',
    'inputOption.activeBackground': '#00000000',
    'inputOption.activeBorder': '#00000000',
    'inputOption.activeForeground': '#ffffff',
    'inputValidation.errorBackground': '#1b1e28',
    'inputValidation.infoBackground': '#506477',
    'inputValidation.warningBackground': '#506477',
    'list.deemphasizedForeground': '#767c9d',
    'list.dropBackground': '#506477',
    'list.filterMatchBackground': '#89ddff60',
    'list.focusOutline': '#00000000',
    'list.invalidItemForeground': '#fffac2',
    'list.warningForeground': '#fffac2',
    'listFilterWidget.background': '#303340',
    'listFilterWidget.noMatchesOutline': '#d0679d',
    'listFilterWidget.outline': '#00000000',
    'list.activeSelectionBackground': '#30334080',
    'list.activeSelectionForeground': '#e4f0fb',
    'list.errorForeground': '#d0679d',
    'list.focusBackground': '#30334080',
    'list.focusForeground': '#a6accd',
    'list.highlightForeground': '#5fb3a1',
    'list.hoverBackground': '#30334080',
    'list.hoverForeground': '#e4f0fb',
    'list.inactiveSelectionBackground': '#30334080',
    'list.inactiveSelectionForeground': '#e4f0fb',
    'menu.background': '#1b1e28',
    'menu.foreground': '#e4f0fb',
    'menu.selectionBackground': '#303340',
    'menu.selectionForeground': '#7390AA',
    'menu.separatorBackground': '#767c9d',
    'menubar.selectionBackground': '#717cb425',
    'menubar.selectionForeground': '#a6accd',
    'merge.commonContentBackground': '#a6accd29',
    'merge.commonHeaderBackground': '#a6accd66',
    'merge.currentContentBackground': '#5fb3a133',
    'merge.currentHeaderBackground': '#5fb3a180',
    'merge.incomingContentBackground': '#89ddff33',
    'merge.incomingHeaderBackground': '#89ddff80',
    'minimap.errorHighlight': '#d0679d',
    'minimap.findMatchHighlight': '#ADD7FF',
    'minimap.selectionHighlight': '#e4f0fb40',
    'minimap.warningHighlight': '#fffac2',
    'minimapGutter.addedBackground': '#5fb3a180',
    'minimapGutter.deletedBackground': '#d0679d80',
    'minimapGutter.modifiedBackground': '#ADD7FF80',
    'minimapSlider.activeBackground': '#a6accd30',
    'minimapSlider.background': '#a6accd20',
    'minimapSlider.hoverBackground': '#a6accd30',
    'notebook.cellBorderColor': '#1b1e28',
    'notebook.cellInsertionIndicator': '#00000000',
    'notebook.cellStatusBarItemHoverBackground': '#ffffff26',
    'notebook.cellToolbarSeparator': '#303340',
    'notebook.focusedCellBorder': '#00000000',
    'notebook.focusedEditorBorder': '#00000000',
    'notebook.focusedRowBorder': '#00000000',
    'notebook.inactiveFocusedCellBorder': '#00000000',
    'notebook.outputContainerBackgroundColor': '#1b1e28',
    'notebook.rowHoverBackground': '#30334000',
    'notebook.selectedCellBackground': '#303340',
    'notebook.selectedCellBorder': '#1b1e28',
    'notebook.symbolHighlightBackground': '#ffffff0b',
    'notebookScrollbarSlider.activeBackground': '#a6accd25',
    'notebookScrollbarSlider.background': '#00000050',
    'notebookScrollbarSlider.hoverBackground': '#a6accd25',
    'notebookStatusErrorIcon.foreground': '#d0679d',
    'notebookStatusRunningIcon.foreground': '#a6accd',
    'notebookStatusSuccessIcon.foreground': '#5fb3a1',
    'notificationCenterHeader.background': '#303340',
    'notificationLink.foreground': '#ADD7FF',
    'notifications.border': '#303340',
    'notificationsErrorIcon.foreground': '#d0679d',
    'notificationsInfoIcon.foreground': '#ADD7FF',
    'notificationsWarningIcon.foreground': '#fffac2',
    'panel.background': '#1b1e28',
    'panel.dropBorder': '#a6accd',
    'panelSection.border': '#1b1e28',
    'panelSection.dropBackground': '#7390AA80',
    'panelSectionHeader.background': '#303340',
    'panelTitle.activeBorder': '#a6accd',
    'panelTitle.inactiveForeground': '#a6accd99',
    'peekViewEditor.matchHighlightBackground': '#303340',
    'peekViewResult.fileForeground': '#ffffff',
    'peekViewResult.lineForeground': '#a6accd',
    'peekViewResult.matchHighlightBackground': '#303340',
    'peekViewResult.selectionBackground': '#717cb425',
    'peekViewResult.selectionForeground': '#ffffff',
    'peekViewTitleLabel.foreground': '#ffffff',
    'pickerGroup.border': '#a6accd',
    'pickerGroup.foreground': '#89ddff',
    'problemsErrorIcon.foreground': '#d0679d',
    'problemsInfoIcon.foreground': '#ADD7FF',
    'problemsWarningIcon.foreground': '#fffac2',
    'progressBar.background': '#89ddff',
    'quickInput.background': '#1b1e28',
    'quickInput.foreground': '#a6accd',
    'quickInputList.focusBackground': '#a6accd10',
    'quickInputTitle.background': '#ffffff1b',
    'sash.hoverBorder': '#00000000',
    'scm.providerBorder': '#e4f0fb10',
    'searchEditor.findMatchBackground': '#ADD7FF50',
    'searchEditor.textInputBorder': '#ffffff10',
    'settings.checkboxBackground': '#1b1e28',
    'settings.checkboxBorder': '#ffffff10',
    'settings.checkboxForeground': '#e4f0fb',
    'settings.dropdownBackground': '#1b1e28',
    'settings.dropdownBorder': '#ffffff10',
    'settings.dropdownForeground': '#e4f0fb',
    'settings.dropdownListBorder': '#e4f0fb10',
    'settings.focusedRowBackground': '#00000000',
    'settings.headerForeground': '#e4f0fb',
    'settings.modifiedItemIndicator': '#ADD7FF',
    'settings.numberInputBackground': '#ffffff05',
    'settings.numberInputBorder': '#ffffff10',
    'settings.numberInputForeground': '#e4f0fb',
    'settings.textInputBackground': '#ffffff05',
    'settings.textInputBorder': '#ffffff10',
    'settings.textInputForeground': '#e4f0fb',
    'sideBar.dropBackground': '#7390AA80',
    'sideBarSectionHeader.foreground': '#a6accd',
    'statusBar.debuggingBackground': '#303340',
    'statusBar.debuggingForeground': '#ffffff',
    'statusBar.noFolderForeground': '#a6accd',
    'statusBarItem.activeBackground': '#ffffff2e',
    'statusBarItem.errorBackground': '#d0679d',
    'statusBarItem.errorForeground': '#ffffff',
    'statusBarItem.hoverBackground': '#ffffff1f',
    'statusBarItem.prominentBackground': '#00000080',
    'statusBarItem.prominentForeground': '#a6accd',
    'statusBarItem.prominentHoverBackground': '#0000004d',
    'statusBarItem.remoteBackground': '#303340',
    'statusBarItem.remoteForeground': '#e4f0fb',
    'symbolIcon.arrayForeground': '#a6accd',
    'symbolIcon.booleanForeground': '#a6accd',
    'symbolIcon.classForeground': '#fffac2',
    'symbolIcon.colorForeground': '#a6accd',
    'symbolIcon.constantForeground': '#a6accd',
    'symbolIcon.constructorForeground': '#f087bd',
    'symbolIcon.enumeratorForeground': '#fffac2',
    'symbolIcon.enumeratorMemberForeground': '#ADD7FF',
    'symbolIcon.eventForeground': '#fffac2',
    'symbolIcon.fieldForeground': '#ADD7FF',
    'symbolIcon.fileForeground': '#a6accd',
    'symbolIcon.folderForeground': '#a6accd',
    'symbolIcon.functionForeground': '#f087bd',
    'symbolIcon.interfaceForeground': '#ADD7FF',
    'symbolIcon.keyForeground': '#a6accd',
    'symbolIcon.keywordForeground': '#a6accd',
    'symbolIcon.methodForeground': '#f087bd',
    'symbolIcon.moduleForeground': '#a6accd',
    'symbolIcon.namespaceForeground': '#a6accd',
    'symbolIcon.nullForeground': '#a6accd',
    'symbolIcon.numberForeground': '#a6accd',
    'symbolIcon.objectForeground': '#a6accd',
    'symbolIcon.operatorForeground': '#a6accd',
    'symbolIcon.packageForeground': '#a6accd',
    'symbolIcon.propertyForeground': '#a6accd',
    'symbolIcon.referenceForeground': '#a6accd',
    'symbolIcon.snippetForeground': '#a6accd',
    'symbolIcon.stringForeground': '#a6accd',
    'symbolIcon.structForeground': '#a6accd',
    'symbolIcon.textForeground': '#a6accd',
    'symbolIcon.typeParameterForeground': '#a6accd',
    'symbolIcon.unitForeground': '#a6accd',
    'symbolIcon.variableForeground': '#ADD7FF',
    'terminal.border': '#00000000',
    'terminal.foreground': '#a6accd',
    'terminal.selectionBackground': '#717cb425',
    'terminalCommandDecoration.errorBackground': '#d0679d',
    'terminalCommandDecoration.successBackground': '#A888F1',
    'terminalCommandDecoration.defaultBackground': '#767c9d',
    'testing.iconErrored': '#d0679d',
    'testing.iconFailed': '#d0679d',
    'testing.iconPassed': '#A888F1',
    'testing.iconQueued': '#fffac2',
    'testing.iconSkipped': '#7390AA',
    'testing.iconUnset': '#7390AA',
    'testing.message.error.decorationForeground': '#d0679d',
    'testing.message.error.lineBackground': '#d0679d33',
    'testing.message.hint.decorationForeground': '#7390AAb3',
    'testing.message.info.decorationForeground': '#ADD7FF',
    'testing.message.info.lineBackground': '#89ddff33',
    'testing.message.warning.decorationForeground': '#fffac2',
    'testing.message.warning.lineBackground': '#fffac233',
    'testing.peekBorder': '#d0679d',
    'testing.runAction': '#A888F1',
    'textBlockQuote.background': '#7390AA1a',
    'textBlockQuote.border': '#89ddff80',
    'textCodeBlock.background': '#00000050',
    'textPreformat.foreground': '#e4f0fb',
    'textSeparator.foreground': '#ffffff2e',
    'tree.tableColumnsBorder': '#a6accd20',
    'welcomePage.progress.background': '#ffffff05',
    'welcomePage.progress.foreground': '#5fb3a1',
    'welcomePage.tileBackground': '#1b1e28',
    'welcomePage.tileHoverBackground': '#303340',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#767c9d', fontStyle: 'italic' },
    },
    {
      scope: 'meta.parameters comment.block',
      settings: { foreground: '#a6accd', fontStyle: 'italic' },
    },
    {
      scope: [
        'variable.other.constant.object',
        'variable.other.readwrite.alias',
        'meta.import variable.other.readwrite',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['variable.other', 'support.type.object'],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: [
        'variable.other.object.property',
        'variable.other.property',
        'support.variable.property',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: [
        'entity.name.function.method',
        'string.unquoted',
        'meta.object.member',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'variable - meta.import',
        'constant.other.placeholder',
        'meta.object-literal.key-meta.object.member',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    { scope: ['keyword.control.flow'], settings: { foreground: '#A888F1' } },
    {
      scope: ['keyword.operator.new', 'keyword.control.new'],
      settings: { foreground: '#A888F1' },
    },
    {
      scope: [
        'variable.language.this',
        'storage.modifier.async',
        'storage.modifier',
        'variable.language.super',
      ],
      settings: { foreground: '#A888F1' },
    },
    {
      scope: [
        'support.class.error',
        'keyword.control.trycatch',
        'keyword.operator.expression.delete',
        'keyword.operator.expression.void',
        'keyword.operator.void',
        'keyword.operator.delete',
        'constant.language.null',
        'constant.language.boolean.false',
        'constant.language.undefined',
      ],
      settings: { foreground: '#d0679d' },
    },
    {
      scope: [
        'variable.parameter',
        'variable.other.readwrite.js',
        'meta.definition.variable variable.other.constant',
        'meta.definition.variable variable.other.readwrite',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    { scope: ['constant.other.color'], settings: { foreground: '#ffffff' } },
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: '#d0679d' },
    },
    { scope: ['invalid.deprecated'], settings: { foreground: '#d0679d' } },
    {
      scope: ['keyword.control', 'keyword'],
      settings: { foreground: '#a6accd' },
    },
    {
      scope: ['keyword.operator', 'storage.type'],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: [
        'keyword.control.module',
        'keyword.control.import',
        'keyword.control.export',
        'keyword.control.default',
        'meta.import',
        'meta.export',
      ],
      settings: { foreground: '#A888F1' },
    },
    { scope: ['Keyword', 'Storage'], settings: { fontStyle: 'italic' } },
    { scope: ['keyword-meta.export'], settings: { foreground: '#ADD7FF' } },
    {
      scope: ['meta.brace', 'punctuation', 'keyword.operator.existential'],
      settings: { foreground: '#a6accd' },
    },
    {
      scope: [
        'constant.other.color',
        'meta.tag',
        'punctuation.definition.tag',
        'punctuation.separator.inheritance.php',
        'punctuation.definition.tag.html',
        'punctuation.definition.tag.begin.html',
        'punctuation.definition.tag.end.html',
        'punctuation.section.embedded',
        'keyword.other.template',
        'keyword.other.substitution',
        'meta.objectliteral',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    { scope: ['support.class.component'], settings: { foreground: '#A888F1' } },
    {
      scope: [
        'entity.name.tag',
        'entity.name.tag',
        'meta.tag.sgml',
        'markup.deleted.git_gutter',
      ],
      settings: { foreground: '#A888F1' },
    },
    {
      name: 'Function Call',
      scope:
        'variable.function, source meta.function-call entity.name.function, source meta.function-call entity.name.function, source meta.method-call entity.name.function, meta.class meta.group.braces.curly meta.function-call variable.function, meta.class meta.field.declaration meta.function-call entity.name.function, variable.function.constructor, meta.block meta.var.expr meta.function-call entity.name.function, support.function.console, meta.function-call support.function, meta.property.class variable.other.class, punctuation.definition.entity.css',
      settings: { foreground: '#e4f0fbd0' },
    },
    {
      name: 'Function/Class Name',
      scope:
        'entity.name.function, meta.class entity.name.class, meta.class entity.name.type.class, meta.class meta.function-call variable.function, keyword.other.important',
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['source.cpp meta.block variable.other'],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['support.other.variable', 'string.other.link'],
      settings: { foreground: '#A888F1' },
    },
    {
      scope: [
        'constant.numeric',
        'support.constant',
        'constant.character',
        'constant.escape',
        'keyword.other.unit',
        'keyword.other',
        'string',
        'constant.language',
        'constant.other.symbol',
        'constant.other.key',
        'markup.heading',
        'markup.inserted.git_gutter',
        'meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js',
        'text.html.derivative',
      ],
      settings: { foreground: '#A888F1' },
    },
    {
      scope: ['entity.other.inherited-class'],
      settings: { foreground: '#ADD7FF' },
    },
    { scope: ['meta.type.declaration'], settings: { foreground: '#ADD7FF' } },
    { scope: ['entity.name.type.alias'], settings: { foreground: '#a6accd' } },
    {
      scope: ['keyword.control.as', 'entity.name.type', 'support.type'],
      settings: { foreground: '#a6accdC0' },
    },
    {
      scope: [
        'entity.name',
        'support.orther.namespace.use.php',
        'meta.use.php',
        'support.other.namespace.php',
        'markup.changed.git_gutter',
        'support.type.sys-types',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: [
        'support.class',
        'support.constant',
        'variable.other.constant.object',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'source.css support.type.property-name',
        'source.sass support.type.property-name',
        'source.scss support.type.property-name',
        'source.less support.type.property-name',
        'source.stylus support.type.property-name',
        'source.postcss support.type.property-name',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'entity.name.module.js',
        'variable.import.parameter.js',
        'variable.other.class.js',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: ['variable.language'],
      settings: { foreground: '#ADD7FF', fontStyle: 'italic' },
    },
    {
      scope: ['entity.name.method.js'],
      settings: { foreground: '#91B4D5', fontStyle: 'italic' },
    },
    {
      scope: [
        'meta.class-method.js entity.name.function.js',
        'variable.function.constructor',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#91B4D5', fontStyle: 'italic' },
    },
    {
      scope: [
        'text.html.basic entity.other.attribute-name.html',
        'text.html.basic entity.other.attribute-name',
      ],
      settings: { foreground: '#5fb3a1', fontStyle: 'italic' },
    },
    {
      scope: ['entity.other.attribute-name.class'],
      settings: { foreground: '#5fb3a1' },
    },
    {
      scope: ['source.sass keyword.control'],
      settings: { foreground: '#42675A' },
    },
    { scope: ['markup.inserted'], settings: { foreground: '#ADD7FF' } },
    { scope: ['markup.deleted'], settings: { foreground: '#506477' } },
    { scope: ['markup.changed'], settings: { foreground: '#91B4D5' } },
    { scope: ['string.regexp'], settings: { foreground: '#5fb3a1' } },
    {
      scope: ['constant.character.escape'],
      settings: { foreground: '#5fb3a1' },
    },
    {
      scope: ['*url*', '*link*', '*uri*'],
      settings: { foreground: '#ADD7FF', fontStyle: 'underline' },
    },
    {
      scope: [
        'tag.decorator.js entity.name.tag.js',
        'tag.decorator.js punctuation.definition.tag.js',
      ],
      settings: { foreground: '#42675A', fontStyle: 'italic' },
    },
    {
      scope: [
        'source.js constant.other.object.key.js string.unquoted.label.js',
      ],
      settings: { foreground: '#5fb3a1', fontStyle: 'italic' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#7390AA' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#7390AA' },
    },
    {
      scope: [
        'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: [
        'text.html.markdown',
        'punctuation.definition.list_item.markdown',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: ['text.html.markdown markup.inline.raw.markdown'],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: [
        'markdown.heading',
        'markup.heading | markup.heading entity.name',
        'markup.heading.markdown punctuation.definition.heading.markdown',
      ],
      settings: { foreground: '#e4f0fb' },
    },
    {
      scope: ['markup.italic'],
      settings: { foreground: '#7390AA', fontStyle: 'italic' },
    },
    {
      scope: ['markup.bold', 'markup.bold string'],
      settings: { foreground: '#7390AA', fontStyle: 'bold' },
    },
    {
      scope: [
        'markup.bold markup.italic',
        'markup.italic markup.bold',
        'markup.quote markup.bold',
        'markup.bold markup.italic string',
        'markup.italic markup.bold string',
        'markup.quote markup.bold string',
      ],
      settings: { foreground: '#7390AA', fontStyle: 'bold' },
    },
    {
      scope: ['markup.underline'],
      settings: { foreground: '#7390AA', fontStyle: 'underline' },
    },
    { scope: ['markup.strike'], settings: { fontStyle: 'italic' } },
    {
      scope: ['markup.quote punctuation.definition.blockquote.markdown'],
      settings: { foreground: '#A888F1' },
    },
    { scope: ['markup.quote'], settings: { fontStyle: 'italic' } },
    {
      scope: ['string.other.link.title.markdown'],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['string.other.link.description.title.markdown'],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['constant.other.reference.link.markdown'],
      settings: { foreground: '#ADD7FF' },
    },
    { scope: ['markup.raw.block'], settings: { foreground: '#ADD7FF' } },
    {
      scope: ['markup.raw.block.fenced.markdown'],
      settings: { foreground: '#50647750' },
    },
    {
      scope: ['punctuation.definition.fenced.markdown'],
      settings: { foreground: '#50647750' },
    },
    {
      scope: [
        'markup.raw.block.fenced.markdown',
        'variable.language.fenced.markdown',
        'punctuation.section.class.end',
      ],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: ['variable.language.fenced.markdown'],
      settings: { foreground: '#91B4D5' },
    },
    {
      scope: ['meta.separator'],
      settings: { foreground: '#7390AA', fontStyle: 'bold' },
    },
    { scope: ['markup.table'], settings: { foreground: '#ADD7FF' } },
    { scope: 'token.info-token', settings: { foreground: '#89ddff' } },
    { scope: 'token.warn-token', settings: { foreground: '#fffac2' } },
    { scope: 'token.error-token', settings: { foreground: '#d0679d' } },
    { scope: 'token.debug-token', settings: { foreground: '#e4f0fb' } },
    {
      scope: [
        'entity.name.section.markdown',
        'markup.heading.setext.1.markdown',
        'markup.heading.setext.2.markdown',
      ],
      settings: { foreground: '#e4f0fb', fontStyle: 'bold' },
    },
    { scope: 'meta.paragraph.markdown', settings: { foreground: '#e4f0fbd0' } },
    {
      scope: [
        'punctuation.definition.from-file.diff',
        'meta.diff.header.from-file',
      ],
      settings: { foreground: '#506477' },
    },
    {
      scope: 'markup.inline.raw.string.markdown',
      settings: { foreground: '#7390AA' },
    },
    { scope: 'meta.separator.markdown', settings: { foreground: '#767c9d' } },
    { scope: 'markup.bold.markdown', settings: { fontStyle: 'bold' } },
    { scope: 'markup.italic.markdown', settings: { fontStyle: 'italic' } },
    {
      scope: [
        'beginning.punctuation.definition.list.markdown',
        'punctuation.definition.list.begin.markdown',
        'markup.list.unnumbered.markdown',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'string.other.link.description.title.markdown punctuation.definition.string.markdown',
        'meta.link.inline.markdown string.other.link.description.title.markdown',
        'string.other.link.description.title.markdown punctuation.definition.string.begin.markdown',
        'string.other.link.description.title.markdown punctuation.definition.string.end.markdown',
        'meta.image.inline.markdown string.other.link.description.title.markdown',
      ],
      settings: { foreground: '#ADD7FF', fontStyle: '' },
    },
    {
      scope: [
        'meta.link.inline.markdown string.other.link.title.markdown',
        'meta.link.reference.markdown string.other.link.title.markdown',
        'meta.link.reference.def.markdown markup.underline.link.markdown',
      ],
      settings: { foreground: '#ADD7FF', fontStyle: 'underline' },
    },
    {
      scope: [
        'markup.underline.link.markdown',
        'string.other.link.description.title.markdown',
      ],
      settings: { foreground: '#A888F1' },
    },
    {
      scope: ['fenced_code.block.language', 'markup.inline.raw.markdown'],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: [
        'punctuation.definition.markdown',
        'punctuation.definition.raw.markdown',
        'punctuation.definition.heading.markdown',
        'punctuation.definition.bold.markdown',
        'punctuation.definition.italic.markdown',
      ],
      settings: { foreground: '#ADD7FF' },
    },
    {
      scope: ['source.ignore', 'log.error', 'log.exception'],
      settings: { foreground: '#d0679d' },
    },
    { scope: ['log.verbose'], settings: { foreground: '#a6accd' } },
  ],
}

export { corvu as default }
