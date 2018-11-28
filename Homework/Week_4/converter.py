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
    Opens the file and makes a dataframe of the right data
    """

    all_data = pandas.read_csv("data.csv")
    right_data = all_data.dropna()
    time = right_data.loc[time['TIME'] == "2016"]

    return time

def convert(time):
    """
    Makes a json file of the data
    """

    # makes a dictionary for the data for the json file
    value_dict = time.to_dict('index')

    # makes a json file of the data
    with open('tim.json', 'w') as outfile:
        json.dump(value_dict, outfile)

if __name__ == "__main__":

    nigel_1 = open_csv("data.csv")
    nigel_2 = convert(nigel_1)
