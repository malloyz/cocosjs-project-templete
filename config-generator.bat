@echo on
rem �ļ����·��
set fileStorePath=%cd%/src/data
rem excel�ļ�Ŀ¼
set excelRootPath=%cd%/excel/config
node tools/configObject-generator/generator.js %fileStorePath%/ %excelRootPath% configObject debug
pause