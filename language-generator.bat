@echo on
rem 文件存放路径
set fileStorePath=%cd%/src/data
rem 语言excel文件路径
set languageExcelPath=%cd%/excel/language.xlsx
node tools/language-generator/generator.js %fileStorePath%/ %languageExcelPath% debug
pause