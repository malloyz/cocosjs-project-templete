@echo on
rem �ļ����·��
set fileStorePath=%cd%/src/data
rem ����excel�ļ�·��
set languageExcelPath=%cd%/excel/language.xlsx
node tools/language-generator/generator.js %fileStorePath%/ %languageExcelPath% debug
pause