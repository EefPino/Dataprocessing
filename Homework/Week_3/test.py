import os
import pathlib

print(os.getcwd())
print(os.listdir('.'))

with open("test.txt", 'w') as outfile2:
      outfile2.write("test")
#
with open("test.txt") as f:
    print(pathlib.Path(f.name).absolute())

with open("C:\\Users\\eveli\\Documents\\Dataprocessing\\Homework\\Week_3\\test.txt") as f:
    print(f.read())
