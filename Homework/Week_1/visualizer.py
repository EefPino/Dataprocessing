#!/usr/bin/env python
# Name: Eveline Tiekink
# Student number: 11267321
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Opens the file with movies
with open("movies.csv", newline="") as csvfile:

    # Makes a dictionary of the movies
    numb_movies = csv.DictReader(csvfile)

    # Searches to the Year and Rating of the movies
    for line in numb_movies:
        data_dict[line["Year"]].append(float(line["Rating"]))

    # Makes lists for the axis
    average = []
    years = []

    # Calculates the average of the ratings
    for year in data_dict:
        average.append((sum(data_dict[year])) / len(data_dict[year]))
        years.append(year)

    # Plots the graph with (axis) titles
    plt.plot(years, average)
    plt.xlabel("Years")
    plt.ylabel("Average Rating")
    plt.title("The Average of the Best Movies", fontsize=14, fontweight="bold",
               color="pink")

    # Shows the graph
    plt.show()

if __name__ == "__main__":
    print(data_dict)
