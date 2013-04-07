mkdir Release
mkdir Release\cultures
del /Q Release\*.*
del /Q out.~js
copy /Y stringformat.js Release\stringformat.src.js
copy /Y stringformat.tests.js Release\
copy /Y license.txt Release\
copy /Y readme.txt Release\
copy /Y changelog.txt Release\
copy /Y tests.html Release\
xcopy /D /Y cultures\*.* Release\cultures\

compiler.jar --js=stringformat.js --js_output_file=out.~js
copy /B header.txt + out.~js Release\stringformat.js
del /Q out.~js