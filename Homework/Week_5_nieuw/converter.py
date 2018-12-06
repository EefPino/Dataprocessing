# Name: Eveline Tiekink
# Student number: 11267321

import csv
import json
import pandas

def open_csv(population_data):
    """
    Opens the file and makes a dataframe of the data
    """
    with open(population_data, "r") as file:

        # makes dataframes of all the needed countries
        dataframe = pandas.read_csv("population.csv")
        france = dataframe.loc[dataframe["Country Name"] == "France"]
        netherlands = dataframe.loc[dataframe["Country Name"] == "Netherlands"]
        portugal = dataframe.loc[dataframe["Country Name"] == "Portugal"]
        germany = dataframe.loc[dataframe["Country Name"] == "Germany"]
        united_kingdom = dataframe.loc[dataframe["Country Name"] == "United Kingdom"]
        korea = dataframe.loc[dataframe["Country Name"] == "Korea Rep."]

        # makes dataframes the countries of 2016
        france_civ = france.iloc[-1]
        netherlands_civ = netherlands.iloc[-1]
        portugal_civ = portugal.iloc[-1]
        germany_civ = germany.iloc[-1]
        united_kingdom_civ = united_kingdom.iloc[-1]
        korea_civ = korea.iloc[-1]

        # makes lists of the values and the countries
        values = france_civ["Value"], netherlands_civ["Value"], portugal_civ["Value"], germany_civ["Value"], united_kingdom_civ["Value"], korea_civ["Value"]
        countries = france_civ["Country Name"], netherlands_civ["Country Name"], portugal_civ["Country Name"], germany_civ["Country Name"], united_kingdom_civ["Country Name"], korea_civ["Country Name"]

        return(values, countries)

def convert(data):
    """
    Makes a csv file from the data
    """

    with open('persons.csv', 'w') as csv_file:
        writer = csv.writer(csv_file, delimiter=',')
        for line in data:
            writer.writerow(line)


if __name__ == "__main__":

    data = open_csv("population.csv")
    convert(data)
