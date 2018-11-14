# Name: Eveline Tiekink
# Student number: 11267321

import csv
import pandas
import math
import matplotlib.pyplot as plt
import json


def open_csv(infile):
    """
    Opens the file and makes lists of the following:
    - countries
    - region
    - pop_density
    - infant_mortality
    - GDP
    """

    with open(infile, "r") as file:

        # Reads the csv file
        text = csv.reader(file)

        # Makes lists
        countries = []
        region = []
        pop_density = []
        infant_mortality = []
        GDP_number = []

        # Takes each line from the text
        for i, line in enumerate(text):

            # Changes the wrong GDP of Suriname with number 388
            if i == 388:
                for j in line:
                    if "dollars" in j:
                        line[8] = line[8].replace("400000", "5900")

        # Iterates over the lines and appends the data to the right list
            for j, word in enumerate(line):
                if j is 0 and "Country" not in word:
                    countries.append(word)
                if j is 1 and "Region" not in word:
                    region.append(word)
                if j is 4 and "Pop." not in word:
                    pop_density.append(word)
                if j is 7 and "Infant" not in word:
                    infant_mortality.append(word)
                if j is 8:

                    # Gives "part" a value and appends the GDP's without "dollars"
                    part = "nothing"
                    if "GDP" not in word:
                        part = word.replace(" dollars", "")
                        GDP_number.append(part)

    return(GDP_number, infant_mortality, region, countries, pop_density)


def central_tendency(GDP_numbers):
    """
    Calculates the mean, median, mode and standard deviation of the GDP's.
    """

    # Sums all the GDP's
    summation = 0
    for number in GDP_numbers:

        # Deletes the GDP's which are unknown
        if number == "unknown" or number == "":
            GDP_numbers.remove(number)
    for number in GDP_numbers:
        summation += int(number)

    # Calculates the mean of all the GDP's
    mean = summation / len(GDP_numbers)
    print("Mean of the GDP's:", mean)

    # Calculates the standard deviation of the GDP
    for i in range(len(GDP_numbers)):
        std = math.sqrt((int(GDP_numbers[i][0]) - mean) ** 2) / (len(GDP_numbers) - 1)
    print("Standard deviation of the GDP's:", std)

    # Makes a dataframe of the GDP numbers
    GDP_numbers_2 = pandas.DataFrame(GDP_numbers)

    # Calculates the mean of the GDP's
    median = GDP_numbers_2.median()
    print("Median of the GDP's:", median[0])

    # Calculates the mode of the GDP's
    mode = GDP_numbers_2.mode()
    print("Mode of the GDP's:", mode[0][0])

    return(GDP_numbers_2)

def histogram(GDP_numbers_2):
    """
    Plots a histogram of the GDP's with (axis) titles
    """

    pandas.to_numeric(GDP_numbers_2[0]).hist(bins = 40, color = "hotpink")
    plt.xlabel("GDP ($ per capita)")
    plt.ylabel("Frequency")
    plt.suptitle("The GDP", fontsize = 14, fontweight = "bold",
               color = "hotpink")
    plt.title("Eveline Tiekink, 2018", fontsize = 10, color = "hotpink")

    # Shows the graph
    plt.show()

def boxplot(infant_mortality):
    """
    Makes a boxplot of the infant mortality
    """

    # Makes a dataframe of the infanity mortality
    infant_mortality_2 = pandas.DataFrame(infant_mortality[1:])

    # Replaces the commas for points in the numbers
    for i in range(len(infant_mortality_2[0])):
        infant_mortality_2[0][i] = infant_mortality_2[0][i].replace(",", ".")

    # Makes the numbers to real digits
    infant_mortality_2[0] = pandas.to_numeric(infant_mortality_2[0])

    # Plots a boxplot of the infant mortality with titles
    infant_mortality_2.boxplot(patch_artist = True, boxprops = dict(linewidth = 3,
                               color = "pink"), medianprops = dict(linewidth = 3))
    plt.ylabel("Infant mortality")
    plt.suptitle("Infant mortality (per 1000 births)", fontsize = 14,
              fontweight = "bold", color = "hotpink")
    plt.title("Eveline Tiekink, 2018", fontsize = 10, color = "hotpink")

    # Shows the graph
    plt.show()


def json_file(files):
    """
    Makes a json file of the data
    """

    # Replaces the commas for points in the infant mortality and pop. density
    for i in range(len(files[1])):
         files[1][i] = files[1][i].replace(",", ".")
         files[4][i] = files[4][i].replace(",", ".")

    # Makes a dictionary for the data for the json file
    json_dict = {}

    # Adds the countries as keys in the dictionary and all the data as items
    for i, country in enumerate(files[3]):
        dict = {country: {}}
        dict[country]["Region"] = files[2][i].strip()
        dict[country]["Pop. Density (per sq. mi.)"] = files[4][i]
        dict[country]["infant_mortality (per 1000 births)"] = files[1][i]
        dict[country]["GDP ($ per capita) dollars"] = files[0][i]
        json_dict.update(dict)

    # Makes a json file of the data
    with open('data.json', 'w') as outfile:
        json.dump(json_dict, outfile, indent = 1)

if __name__ == "__main__":

    tim = open_csv("infile.csv")
    kim = json_file(tim)
    nigel = central_tendency(tim[0])
    thomas = histogram(nigel)
    rosa = boxplot(tim[1])
