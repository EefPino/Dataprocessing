# Name: Eveline Tiekink
# Student number: 11267321
# converter for the Linked views for the UvA course Dataprocessing

import csv
import json
import pandas

def open_csv(immigration_data):
    """
    Opens the file and makes a dataframe of the data
    """

    dataframe = pandas.read_csv("immigration_2.csv", sep=";")

    # reads and writes a csv file
    with open("immigration_2.csv", "r") as file:
        with open('data_two.csv', 'w') as csvfile:

            # makes a dictionary
            read_csv = csv.DictReader(file, delimiter=';', quotechar='|')
            first_row = 1

            # writes the right data
            for row in read_csv:
                if first_row == 1:
                    writer = csv.DictWriter(csvfile, fieldnames=row.keys())
                    writer.writeheader()
                    first_row = 0

                if row["Perioden"] == "2017":
                    writer = csv.DictWriter(csvfile, fieldnames=row.keys())
                    writer.writerow(row)

    # writes an new json file
    data_1 = dataframe.pivot(index = "Migratieachtergrond", columns = "Perioden", values = "Totaal bevolking (aantal)")
    data_1.to_json("data_1.json", orient = "index")

    return data_1

if __name__ == "__main__":
    open_csv("immigration_2.csv")
