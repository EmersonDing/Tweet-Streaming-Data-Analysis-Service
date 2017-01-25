# Twitter-Analyzer
### What's Twitter Analyzer?
There're two major functions of twitter analyzer. The first one is stream data analysis. With tweey api, twitter_analyzer can get twitter stream data from twitter database, and the system will save data in Redis, and then parse and analyze data, eventually show the statistic result. <br />
The second function is keyword graph analysis based on offline data. System will save twitter data into a local mongodb, and extract keyword from each twitter, and create a keyword graph, e.g. for a twitter "Donald Trump has won the election over Hilary Clinton with 4 points.", keyword like "Donald Trump", "election" and "Hilary Clinton" will be extracted, and a connected graph with these three keyword as nodes will be build and saved. And for the second part of the system, when a user search for "Donald Trump", system will show the neighbors of this keyword, in this case it will be "Hilary Clinton", "election" and their frequency, and user can choose the topic he's interested. With another click to "Hilary Clinton", system will show all of the twitters related to both "Donald Trump" and "Hilary Clinton".  <br />

### Directory
master branch contains web2py code <br />
Nan branch contains keyword_graph code <br />

### Function I -- live streaming twitter data analysis and visualization
In this part, we used Twitter API to get streaming tweets. The textarea is used as keyword to determine what tweets will be delivered on the stream. Type of analysis and number of tweet are used when analysis the streaming tweets. Type of analysis has two options: one is 'Device', which is the device the user send the tweet with, for example 'Twitter for iPhone', 'Twitter for Android'. The other option is hashtag, which will count the hashtags in each tweet. Number of tweet gives the users an option to choose how many tweets do they want to stream during each search. Number of column is a parameter used when visualize the data through column charts. The more columns you choose, the richer information you will have. All the analyzed data are stored and updated in redis. Since the streaming process might be slow, consider some keywords are rare, every two seconds an ajax call is made to the server to retrieve the data in redis. This will give a real-time updated chart before the whole process end. We used single-thread here, so the latter call to stream the tweets should be made only after the previous call ends.

### Function II -- stored streaming twitter data analysys
With millions of streaming tweets being saved in MongoDB, a keyword graph will be created with each keyword connects to other keywords once appeared in the same tweet with this keyword. The weight of these edges are the frequency that they appeared together. Graph is saved as {string, array[string]} in keyword_graph collection in MongoDB, with a cache layer used to ease the overhead from disk I/O. Visualized effect with D3 and search function is also added in web2py.
