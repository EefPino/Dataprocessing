#!/usr/bin/env python
# Name: Eveline Tiekink
# Student number: 11267321
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = "movies.html"
OUTPUT_CSV = "movies.csv"


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Makes lists for the title and the actors
    title = []
    actors = []
    actors_movie = []

    # Finds all the anchor tags in the html file
    movielist = dom.find_all("a")

    # Looks to the href phrases
    for movie in movielist:
        line = movie.get("href")

        # looks if the href phrase consists a title
        if "adv_li_tt" in line:

            # Appends the actor list of a movie to the whole actor list
            if len(title) > 0:
                actors.append(actors_movie)
            actors_movie = []

            # Appends the title of a movie to the whole title list
            title.append(movie.string)

        # looks if the href phrase consists an actor
        elif "adv_li_st" in line:
            actors_movie.append(movie.string)

    # Appends the last actor list of a movie to the whole actor list
    actors.append(actors_movie)

    # Makes a list for the year the movie released
    year = []

    # Finds all the span tags with "lister-item-year" in the html file
    year_list = dom.find_all("span", "div", class_="lister-item-year")

    # Takes all the "lister-item-year" items, strips and appends them
    for item in year_list:
         item = item.string.split(" ")
         item = item[-1].strip("()")
         year.append(item)

    # Makes a list for the runtime of the movie
    runtime = []

    # Finds all the span tags with "runtime" in the html file
    runtime_list = dom.find_all("span", "div", class_="runtime")

    # Takes all the "runtime" items and strips and appends them
    for section in runtime_list:
        line = section.text
        line = line.strip(" min")
        runtime.append(line)

    # Makes a list for the rating of the movie
    rating = []

    # Finds all the strong tags
    ratinglist = dom.find_all("strong")

    # Searches to specific digits and appends them
    for part in ratinglist:
        integer = part.string
        number = integer.replace(".", "", 1)
        if number.isdigit() and len(number) is 2 and len(integer) is 3:
            rating.append(part.string)

    return [title, rating, year, actors, runtime]

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(["Title", "Rating", "Year", "Actors", "Runtime"])

    # Makes a list for all the movies
    movie = []

    # Makes a list for each title in the movielist
    for i, title in enumerate(movies[0]):
        movie.append([title])

    # Appends the rating, year, actors and runtime to the lists of the movies
    for i, rating in enumerate(movies[1]):
        movie[i].append(rating)
    for i, year in enumerate(movies[2]):
        movie[i].append(year)
    for i, actors in enumerate(movies[3]):

        # Lets the brackets and quotation marks disappear
        movies[3][i] = str(actors).replace("[","").replace("]","").replace("'","")
        movie[i].append(actors)
    for i, runtime in enumerate(movies[4]):
        movie[i].append(runtime)

    # Writes all the movies in the file
    for i in range(len(movies[0])):
        writer.writerow(movie[i])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print("The following error occurred during HTTP GET request to {0} : {1}"
               .format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers["Content-Type"].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find("html") > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, "wb") as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, "html.parser")

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV,"w", newline="") as output_file:
        save_csv(output_file, movies)
