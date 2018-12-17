# Name: Eveline Tiekink
# Student number: 11267321

import csv
import json
import pandas

def open_csv(immigration_data):
    """
    Opens the file and makes a dataframe of the data
    """

    dataframe = pandas.read_csv("immigration_2.csv", sep=";")

    with open("immigration_2.csv", "r") as file:
        with open('data_two.csv', 'w') as csvfile:

            read_csv = csv.DictReader(file, delimiter=';', quotechar='|')

            first_row = 1

            for row in read_csv:
                if first_row == 1:
                    writer = csv.DictWriter(csvfile, fieldnames=row.keys())
                    writer.writeheader()
                    first_row = 0
                # print(list(row))
                # writer = csv.DictWriter(csvfile, fieldnames=row.keys())
                if row["Perioden"] == "2017":
                    writer = csv.DictWriter(csvfile, fieldnames=row.keys())
                    print("kip")
                    writer.writerow(row)

    # data_2 = dataframe.to_csv("data_2.csv", sep='\t', encoding='utf-8')
    #
    # # print(data_2)

    # makes dataframes of all the needed continents

    data_1 = dataframe.pivot(index = "Migratieachtergrond", columns = "Perioden", values = "Totaal bevolking (aantal)")
    data_1.to_json("data_1.json", orient = "index")

    # print(data_1.head())

    # data_2 = dataframe.pivot(index = "Migratieachtergrond", columns = "Perioden", values = ["Eerste generatie migratieachtergrond (aantal)", "Tweede generatie migratieachtergrond/Totaal 2e generatie migratieachtergrond (aantal)", "Tweede generatie migratieachtergrond/Eén ouder in buitenland geboren (aantal)", "Tweede generatie migratieachtergrond/Beide ouders in buitenland geboren (aantal)"])
    # # print(data_2.head())
    # data_2.to_json("data_2.json", orient = "index")

    # print(data_1)
    # print(data_2)

    return data_1

if __name__ == "__main__":

    open_csv("immigration_2.csv")
