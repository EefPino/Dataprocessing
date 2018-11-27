# Name: Eveline Tiekink
# Student number: 11267321

import csv
import pandas
import matplotlib.pyplot as plt
import json
from json import dumps, loads, JSONEncoder, JSONDecoder
import pickle
import os

def open_csv(data):
    """
    Opens the file and makes lists of the data.
    """

    tim = pandas.read_csv("data.csv")
    tim = tim.dropna()
    tim = tim.loc[tim['TIME'] == "1960"]
    print(tim)

    # with open(data, "r") as file:
    #
    #     # reads the csv file
    #     text = csv.reader(file)
    #
    #     # LOCATION,"INDICATOR","SUBJECT","MEASURE","FREQUENCY","TIME","Value","Flag Codes"
    #
    #     # takes each dataline from the text
    #     for i, line in enumerate(text):
    #         if i is 0:
    #             for j, word in enumerate(line):
    #                 print(word)
    #                 if word is not '"':
    #                     word = []
    #
    #         else:
    #
    #             # checks if the word is an date or sight and appends it
    #             for j, word in enumerate(line):
    #                 if j is 1:
    #                     dates.append(word)
    #                 if j is 2:
    #                     sight = word.replace(" ", "")
    #
    #                     # looks if sight is empty and deletes it
    #                     if sight is not "":
    #                         sights.append(sight)
    #                     else:
    #                         dates.pop()
    #
    #     return(dates, sights)

def convert_csv(dates_sights):
    """
    Makes a csv file of the data
    """

    pass

    # gets the dates and sights
    # dates = dates_sights[0]
    # sights = dates_sights[1]
    #
    # # opens a csv file and writes in file
    # with open("output.csv", 'w') as f:
    #     data_csv = csv.writer(f, delimiter=' ')
    #
    #     # writes the dates and sights in the csv
    #     for date in dates:
    #         data_csv.writerow(date)
    #     for sight in sights:
    #         data_csv.writerow(sight)

def convert(dates_sights):
    """
    Makes a json file of the data
    """

    # defines the dates and sights
    dates = dates_sights[0]
    sights = dates_sights[1]

    # nakes a dictionary for the data for the json file
    json_dict = {}

    # adds the dates and the sights in the dictionary
    for i, date in enumerate(dates):
        dict = {}
        dict[date]= sights[i]
        json_dict.update(dict)

    # makes a json file of the data
    with open('tim.json', 'w') as outfile:
        json.dump(json_dict, outfile)

if __name__ == "__main__":

    poepie = open_csv("data.csv")
    # dropje = convert_csv(poepie)
    # skatje = convert(poepie)
