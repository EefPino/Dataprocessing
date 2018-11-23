#!/usr/bin/env python

"""
We truthfully declare:
- to have contributed approximately equally to this assignment [if this is not true, modify this sentence to disclose individual contributions so we can grade accordingly]
- that we have neither helped other students nor received help from other students
- that we provided references for all code that is not our own

Name Student 1: Chantal van Dok c.p.van.dok@student.vu.nl
Name Student 2: Romy Rouwendaal r.t.a.rouwendaal@student.vu.nl
"""

# Include these lines without modifications
# Call the script as follows: ./<scriptname> <csv_filename> <mapper function> <reducer function>
# So, for example: ./template_assignment3.py hue_week_3_2017.csv mapper1 reducer1
# This will call the mapper1 function for each line of the data, sort the output, and feed the sorted output into reducer1
import sys
from io import StringIO
import traceback
from queue import Queue
import requests
import json
import threading
import datetime
import operator
from collections import OrderedDict

# Implement these mapper and reducer functions
output = 0
users = {}
users2 = {}
users3 = {}
top5 = {}

def mapper1(line):
    line = line.strip()
    words = line.split(',')
    print('{}\t{}'.format(words[5],1))

def reducer1(line):
    global output
    if line == '':
        print(output)
    
    line = line.strip()
    
    if line.count('\t') == 1:
        fitness, count = line.split('\t')
        if float(fitness) > 50:
            output += int(count)
    
def mapper2(line):
    line = line.strip()
    words = line.split(',')
    print('{}\t{}'.format(words[1],words[5]))
	
def reducer2(line):
    #http://rare-chiller-615.appspot.com/mr1.html
    global users
    if line == '':
        for user in users.keys():
            average_fitness = round(sum(users[user]) / len(users[user]),1)
            print('%s\t%s'%(user, average_fitness))
    
    line = line.replace("\"", "")
    line = line.strip()
    
    if line.count('\t') == 1:
        user,fitness = line.split("\t")
        if user in users:
            users[user].append(float(fitness))
        else:
            users[user] = []
            users[user].append(float(fitness))

def mapper3(line):
    line = line.strip()
    words = line.split(',')
    print('{}\t{}'.format(words[1], words[2]))

def reducer3(line):
    def calculate_mean_bedtime():
        global users2
        for user in users2.keys(): 
           for dt in users2[user]:
               hours = dt.hour
               if 0 <= hours <= 6:
                   hours += 24
           
           #https://stackoverflow.com/questions/19681703/average-time-for-datetime-list
           seconds = sum(hours * 3600 + dt.minute * 60 + dt.second for dt in users2[user])
           avg_seconds = float(seconds / len(users2[user]))
           if avg_seconds >= 24 * 3600:
               avg_seconds -= 24*3600
              
           mean_bedtime = datetime.datetime.utcfromtimestamp(avg_seconds)
           print ('%s\t%s'% (user, mean_bedtime.strftime('%H:%M')))

    if line == '':   
        calculate_mean_bedtime()
        
    line = line.replace("\"", "")
    line = line.strip()
    
    if line.count('\t') == 1:
        user, bedtime = line.split("\t")
        bedtime = datetime.datetime.strptime(bedtime, '%Y-%m-%d %H:%M:%S.%f')
        if user in users2:
            users2[user].append(bedtime)
        else:
            users2[user] = []
            users2[user].append(bedtime)

def mapper4(line):
    line = line.strip()
    words = line.split(',')
    print('{}\t{}\t{}'.format(words[1], words[2], words[4]))

def reducer4(line):
    def topProcrastinators(user, value):
        #https://stackoverflow.com/questions/613183/how-do-i-sort-a-dictionary-by-value
        global top5
        top5[user] = value
        top5 = OrderedDict(sorted(top5.items(),key=operator.itemgetter(1), reverse = True))
        
        if len(top5) > 5:
            del top5[list(top5.keys())[-1]]
            
    if line == '':
        for user in top5:
            print('%s\t%s' %(user, top5[user]))  
            
    line = line.replace("\"", "")
    line = line.strip()
    
    if line.count('\t') == 2:
        user, bedtime, intended = line.split("\t")
        if bedtime != '':
            bedtime = datetime.datetime.strptime(bedtime, '%Y-%m-%d %H:%M:%S.%f')
            intended = datetime.datetime.strptime(intended, '%Y-%m-%d %H:%M:%S')
            difference = int((bedtime - intended).total_seconds())
            
            if difference > 0:
                if user in users3:
                    users3[user] = users3[user] + difference
                else:
                    users3[user] = difference
                topProcrastinators(user, users3[user])

def instantiate_queue():
    return Queue(30)
    
def consume_data_stream(queue):
    r = requests.get('http://stream.meetup.com/2/rsvps', stream = True)
    
    for item in r.iter_lines():
        queue.put(item)
        print(queue.qsize())
        if queue.qsize() == 30:
            r.close()
            return queue
    
def process_queue(queue):
    while not queue.empty():
        element = queue.get()
        if element != None:
            element = json.loads(element)
            if isinstance(element, dict) and 'venue' in element:
                print('(%s, %s)' %(element['venue']['lon'], element['venue']['lat']))
        queue.task_done()

def main():
    queue = instantiate_queue()
    consume_data_stream(queue)
    
    thread_1 = threading.Thread(target=process_queue, args=(queue,))
    thread_2 = threading.Thread(target=process_queue, args=(queue,))
    thread_3 = threading.Thread(target=process_queue, args=(queue,))
    
    thread_1.start()
    thread_2.start()
    thread_3.start()
    
    while True:
        if queue.empty():
            break
    
    queue.put(None)
    queue.put(None)
    queue.put(None)
    
    thread_1.join()
    thread_2.join()
    thread_3.join()
    
if(len(sys.argv) == 4):
    data = sys.argv[1]
    mapper = sys.argv[2]
    reducer = sys.argv[3]
else:
    data = "C:/data/Google Drive/documenten-b/hue_week_3_2017.csv"
    mapper = 'mapper1'
    reducer = 'reducer1'

# Include these lines without modifications
 
if 'old_stdout' not in globals():
    old_stdout = sys.stdout
mystdout = StringIO()
sys.stdout = mystdout


with open(data) as file:
    try:
        for index, line in enumerate(file):
            if index == 0:
                continue
            line = line.strip()
            locals()[mapper](line)
        locals()[mapper](',,,,,,,') 
    except:
        sys.stdout = old_stdout
        print('Error in ' + mapper)
        print('The mapper produced the following output before the error:')
        print(mystdout.getvalue())
        traceback.print_exc()

    sys.stdout = old_stdout
    mapper_lines = mystdout.getvalue().split("\n")

    for index, line in enumerate(sorted(mapper_lines)):
        if index == 0:
            continue
        locals()[reducer](line)
    locals()[reducer]('')

mystdout.close()
    
# End of MapReduce

# Run main
main()
