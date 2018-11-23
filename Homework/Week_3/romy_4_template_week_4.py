# -*- coding: utf-8 -*-
"""
We truthfully declare:
- to have contributed approximately equally to this assignment [if this is not true, modify this sentence to disclose individual contributions so we can grade accordingly]
- that we have neither helped other students nor received help from other students
- that we provided references for all code that is not our own

Name Student 1: Chantal van Dok c.p.van.dok@student.vu.nl
Name Student 2: Romy Rouwendaal r.t.a.rouwendaal@student.vu.nl
"""

"""
This template is meant as a guideline. Feel free to alter existing functions and add new functions.
Remember to use descriptive variable names and to keep functions concise and readable.
"""

sleepdatafile   = 'C:/thedirectory'
surveydatafile  = 'C:/thedirectory'

import pandas as pd
import scipy.stats as ss
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import statsmodels.stats.multitest as multi
import seaborn as sns

df_sleep = pd.DataFrame()
df = pd.DataFrame()

"""
The main() function is called when template_week_4.py is run from the command line.
It is a good place to define the logic of the data flow (for example, reading, transforming, analyzing, visualizing).
"""
def main():
    global df
    df = read_data(sleepdatafile, surveydatafile)
    df = df[df['delay_time'] > 0].astype(float)
    
    experimental_group = df[df['group'] == 1]
    control_group = df[df['group'] == 0]
    
    print(correlate(df['delay_time'].tolist(), df['sleep_time'].tolist(), 'pearson'))
    print(correlate(df['group'].tolist(), df['delay_time'].tolist(), 'pearson'))
    print(correlate(df['age'].tolist(), df['delay_time'].tolist(), 'kendall'))
    print(correlate(df['age'].tolist(), df['delay_time'].tolist(), 'pearson'))
    print(correlate(df['delay_time'].tolist(), df['daytime_sleepiness'].tolist(), 'pearson'))
    print(correlate(df['delay_time'].tolist(), df['chronotype'].tolist(), 'pearson'))
    print(correlate(df['delay_time'].tolist(), df['group'].tolist(), 'pearson'))
    print(correlate(df['delay_time'].tolist(), df['sleep_time'].tolist(), 'pearson'))
                      
    print(ss.normaltest(df['delay_nights'].tolist())) #t-test
    print(ss.normaltest(experimental_group['sleep_time'].tolist() + control_group['sleep_time'].tolist())) #wilcoxon 2sample
    print(ss.normaltest(df['delay_time'].tolist())) #t-test
    
    difference1 = compare(experimental_group['delay_nights'].tolist(), control_group['delay_nights'].tolist(), 't-test')
    difference2 = compare(experimental_group['sleep_time'].tolist(), control_group['sleep_time'].tolist(), 'wilcoxon')
    difference3 = compare(experimental_group['delay_time'].tolist(), control_group['delay_time'].tolist(), 't-test')
    print(multi.multipletests([difference1.pvalue, difference2.pvalue, difference3.pvalue], 0.05, 'bonferroni')) #Adjusted p-values

    corr = df.corr()
    ax = plt.axes()
    sns.heatmap(corr, xticklabels=corr.columns,yticklabels=corr.columns)
    ax.set_title('Pairwise correlations')
    plt.show()
    sns.pairplot(df)
    
    calculate_statistics(df['delay_nights'])
    calculate_statistics(df['delay_time'])
    calculate_statistics(df['sleep_time'])
    calculate_statistics(df['age'])
    calculate_statistics(df['chronotype'])
    calculate_statistics(df['bp_scale'])
    calculate_statistics(df['motivation'])
    calculate_statistics(df['daytime_sleepiness'])
    calculate_statistics(df['self_reported_effectiveness'])
    
    outliers_iqr(df['delay_nights'])
    outliers_iqr(df['delay_time'])
    outliers_iqr(df['sleep_time'])
    outliers_iqr(df['age'])
    outliers_iqr(df['chronotype'])
    outliers_iqr(df['bp_scale'])
    outliers_iqr(df['motivation'])
    outliers_iqr(df['daytime_sleepiness'])
    outliers_iqr(df['self_reported_effectiveness'])
    
    create_hist('delay_nights', 'Number of delayed nights of the participants', 'Number of delayed nights', 'Frequency')
    create_hist('delay_time', 'Delayed time of the participants', 'Delayed time', 'Frequency')
    create_hist('sleep_time','Sleep time of the participants', 'Sleep time', 'Frequency')
    create_hist('age', 'Age of the participants', 'Age', 'Frequency')
    create_hist('chronotype', 'Chronotype of the participants', 'Rating', 'Frequency')
    create_hist('bp_scale','Bp scale of the participants', 'Rating', 'Frequency')
    create_hist('motivation','Motivation of the participants', 'Rating', 'Frequency')
    create_hist('daytime_sleepiness','Daytime sleepiness of the participants', 'Rating', 'Frequency')
    create_hist('self_reported_effectiveness','Self-reported effectiveness of experimental group', 'Rating', 'Frequency')
    
    create_boxplot([experimental_group['sleep_time'].tolist(), control_group['sleep_time'].tolist()], 'Time participants spent in bed each night','Participant group','Bedtime')
    create_boxplot([experimental_group['delay_time'].tolist(), control_group['delay_time'].tolist()], 'Mean time participants spent delaying their bedtime','Participant group','Mean delayed bedtime')
    create_boxplot([experimental_group['delay_nights'].tolist(), control_group['delay_nights'].tolist()], 'Number of nights participants delayed their bedtime','Participant group','Number of nights')
    
    print(regress('delay_time ~ bp_scale + age + group'))   
    
def calculate_statistics(data):
    print(np.mean(data))
    print(np.median(data))
    print(np.std(data))  
    
def create_boxplot(data, title, xlabel, ylabel):
    plt.boxplot(data)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.show()
    
def create_hist(column, title, xlabel, ylabel):
    global df
    fig, axes = plt.subplots(nrows=1, sharex=True, sharey=True)
    df.hist(column = column, bins = 100, ax=axes)
    plt.suptitle(title, x=0.5, y=1.05, ha='center', fontsize='xx-large')
    fig.text(0.5, 0.04, xlabel, ha='center')
    fig.text(0.04, 0.5, ylabel, va='center', rotation='vertical')
    plt.show()
    
def outliers_iqr(data):
    #http://colingorrie.github.io/outlier-detection.html#methods
    quartile_1, quartile_3 = np.percentile(data, [25, 75])
    iqr = quartile_3 - quartile_1
    lower_bound = quartile_1 - (iqr * 1.5)
    upper_bound = quartile_3 + (iqr * 1.5)
    return print('Indices outliers: %s'%np.where((data > upper_bound) | (data < lower_bound))[0])

def read_data(sleepdatafile, surveydatafile): 
    global df_sleep
    df_sleep = pd.read_csv(sleepdatafile, sep = ",")
    df_survey = pd.read_csv(surveydatafile, sep = ",")
    df_series = pd.DataFrame(columns=['ID', 'group', 'delay_nights', 'delay_time'])
    df_series.set_index('ID')
    df_survey.set_index('ID')

    for index, row in df_sleep.iterrows():
        count_delayed = 0
        delay = 0
        for i in range(5, 123, 10):
            if row[i] > 0:
                count_delayed += 1
                delay += row[i]
        if count_delayed == 0:
            delay_time = 0
        else:
            delay_time = int(delay / count_delayed)
        
        count_sleep_time = 0
        sleep = 0
        for i in range(8, 123, 10):
            if not np.isnan(row[i]):
                count_sleep_time += 1
                sleep += row[i]
        if count_sleep_time == 0:
            sleep_time = 0
        else:
            sleep_time = int(sleep / count_sleep_time)
        
        df_series = df_series.append(pd.Series({'ID' : row[0], 'group' : row[1], \
                                        'delay_nights' : count_delayed, \
                                        'delay_time' : delay_time, 'sleep_time' : \
                                        sleep_time}, name=row[0]))
    
    df = pd.merge(df_series, df_survey, on='ID', how='inner')
    return df

def correlate(x, y, test_type):
    if test_type == 'pearson':
        return ss.pearsonr(x,y)
    if test_type == 'kendall':
        return ss.kendalltau(x,y)

def compare(x, y, test_type):
    if test_type == 'wilcoxon':
        return ss.ranksums(x,y)
    if test_type == 't-test':
        return ss.ttest_ind(x,y)

def regress(formula):
    global df
    return smf.ols(formula=formula, data=df).fit().summary()

if __name__ == '__main__':
    main()
