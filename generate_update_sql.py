#!/usr/bin/env python3

# Data from user query
data = '''Aditya M	36 years	All Rounder	9902890795	Regular	1	Y	1	Aditya M
Afthab	25 years	Batsman	7795259224	ICON	2	Y	2	Afthab
Ambrish	34 years	All Rounder	7619379377	Regular	3	Y	3	Ambrish
Anil	40 years	Batsman	9108444706	ICON	4	Y	4	Anil
Anil	25 years	All Rounder	9901115633	Regular	5	Y	5	Anil
Anil Kumar B K	37 years	All Rounder	8310714306	Regular	6	Y	6	Anil Kumar B K
Anil Kumar HR	26 years	All Rounder	9380619989	Regular	7	Y	7	Anil Kumar HR
Anil Reddy	28 years	All Rounder	8123388804	Regular	8	Y	8	Anil Reddy
Apsar Pasha	16 years	Batsman	9986834227	Regular	9	Y	9	Apsar Pasha
Arjun Ramesh Tendulkar	14 years	All Rounder	9742386644	Regular	10	Y	10	Arjun Ramesh Tendulkar
Arun Kumar	28 years	Batsman	9740489284	ICON	11	Y	11	Arun Kumar
Arya	32 years	All Rounder	9611999614	ICON	12	Y	12	Arya
Avinash	31 years	Batsman	8123744990	Regular	13	Y	13	Avinash
Azhar Khan	41 years	Batsman	8693908342	Regular	14	Y	14	Azhar Khan
Babu Prasad	34 years	All Rounder	9620206600	Regular	150	N	150	Babu Prasad
Basavaraj	25 years	Batsman	9148634810	Regular	15	Y	15	Basavaraj
Basavaraj	20 years	All Rounder	9611144490	Regular	151	N	151	Basavaraj
Harish Kumar BC 	42 years	All Rounder	9845827989	Regular	16	Y	16	Harish Kumar BC 
Bharath	28 years	All Rounder	8123263208	ICON	17	Y	17	Bharath
Bharath	29 years	All Rounder	9900310361	ICON	18	Y	18	Bharath
Bharath R	34 years	All Rounder	9632558777	Regular	19	Y	19	Bharath R
Bharath S	31 years	Batsman	7676765445	Regular	20	Y	20	Bharath S
Bhargav K	19 years	Batsman	8123054335	Regular	21	Y	21	Bhargav K
Chandrashekar	39 years	Batsman	9663510908	Regular	22	Y	22	Chandrashekar
Chetan Kumar N	41 years	Bowler	9945621717	Regular	23	Y	23	Chetan Kumar N
Chetan N	35 years	Batsman	9611111666	Regular	152	N	152	Chetan N
Chethan	33 years	Batsman	9008796333	Regular	24	Y	24	Chethan
Chethan	39 years	Batsman	9845944474	Regular	153	N	153	Chethan
Chethan Kumar	38 years	Batsman	9945829499	Regular	25	Y	25	Chethan Kumar
Devendra	40 years	All Rounder	9900922363	Regular	26	Y	26	Devendra
Dhanush B	30 years	All Rounder	9535988176	ICON	27	Y	27	Dhanush B
Dhanush N	29 years	Batsman	9738899414	Regular	28	Y	28	Dhanush N
Dhanush R	22 years	Batsman	7411352556	Regular	29	Y	29	Dhanush R
Dharshan M	25 years	All Rounder	9886311767	Regular	30	Y	30	Dharshan M
Dhruva Kumar	39 years	Batsman	9886668883	Regular	154	N	154	Dhruva Kumar
Dishank	37 years	All Rounder	9008481848	ICON	31	Y	31	Dishank
Girish	46 years	Batsman	9745347173	Regular	32	Y	32	Girish
Gopinath V	42 years	All Rounder	9900676026	Regular	155	N	155	Gopinath V
Goutham	25 years	Batsman	7411721373	Regular	33	Y	33	Goutham
Govardhan	24 years	Batsman	7760993459	Regular	156	N	156	Govardhan
Guru Raghavendra	38 years	Batsman	9686623625	Regular	34	Y	34	Guru Raghavendra
Harish M	40 years	All Rounder	9902032229	Regular	35	Y	35	Harish M
Hitesh G	26 years	All Rounder	9739050679	Regular	36	Y	36	Hitesh G
Indresh Kumar	36 years	All Rounder	9035751115	Regular	37	Y	37	Indresh Kumar
Ishthiyak	28 years	Batsman	9980181786	Regular	38	Y	38	Ishthiyak
Jaga	40 years	All Rounder	9513631219	Regular	39	Y	39	Jaga
Jitin S	22 years	All Rounder	9900900666	Regular	40	Y	40	Jitin S
Kailash	34 years	All Rounder	7259693680	Regular	157	N	157	Kailash
Kantha Kumar	34 years	All Rounder	9742315080	ICON	41	Y	41	Kantha Kumar
Karagappa	45 years	Batsman	9845798817	Regular	42	Y	42	Karagappa
Karthik	38 years	All Rounder	9972418999	Regular	158	N	158	Karthik
Karthik P	28 years	Batsman	8880388889	Regular	43	Y	43	Karthik P
Kashif	22 years	All Rounder	8971110413	ICON	44	Y	44	Kashif
Kiran	31 years	Batsman	9740834449	ICON	45	Y	45	Kiran
Kiran M	25 years	Batsman	7022550833	Regular	46	Y	46	Kiran M
Kishan	16 years	All Rounder	7899392188	Regular	47	Y	47	Kishan
Kishore	33 years	Batsman	9535815098	Regular	48	Y	48	Kishore
Krishnamurthy	34 years	Bowler	9686333928	Regular	49	Y	49	Krishnamurthy
Kumar	28 years	All Rounder	7338632438	Regular	50	Y	50	Kumar
Kunal Bhargava	40 years	All Rounder	9739363656	Regular	159	N	159	Kunal Bhargava
Lavith Reddy	33 years	Batsman	9036785246	Regular	51	Y	51	Lavith Reddy
Likith Reddy	20 years	Bowler	9880616057	Regular	52	Y	52	Likith Reddy
Lingraj	22 years	Batsman	7349651319	Regular	160	N	160	Lingraj
Lokesh J	24 years	Batsman	7022190895	Regular	53	Y	53	Lokesh J
M Vamshi	18 years	All Rounder	9686616327	Regular	54	Y	54	M Vamshi
Madhu Prasad	28 years	Batsman	8050867265	Regular	55	Y	55	Madhu Prasad
Mahadev	28 years	Batsman	9742355554	Regular	161	N	161	Mahadev
Mahadev	26 years	Batsman	9900478358	Regular	162	N	162	Mahadev
Mahesh	47 years	All Rounder	9663993399	Regular	56	Y	56	Mahesh
Mallikarjun	36 years	Bowler	9513465666	Regular	57	Y	57	Mallikarjun
Manish S	22 years	Batsman	9380234874	Regular	58	Y	58	Manish S
Manjunath	49 years	All Rounder	9916976357	Regular	59	Y	59	Manjunath
Manjunath M	46 years	Bowler	9964821055	Regular	60	Y	60	Manjunath M
Manjunath NM	42 years	All Rounder	9945194297	Regular	61	Y	61	Manjunath NM
Manjunath P	37 years	All Rounder	9743015567	Regular	62	Y	62	Manjunath P
Manjunath P	44 years	Batsman	9964399249	ICON	63	Y	63	Manjunath P
Manjunatha	33 years	All Rounder	8147429118	Regular	64	Y	64	Manjunatha
Manjunatha BG	34 years	All Rounder	6362049445	ICON	65	Y	65	Manjunatha BG
Manjunth M	42 years	Batsman	9591589009	Regular	66	Y	66	Manjunth M
Manoj Reddy	23 years	All Rounder	8310511078	Regular	67	Y	67	Manoj Reddy
Mithun M	27 years	All Rounder	9591755567	Regular	68	Y	68	Mithun M
Mithun Murthy	22 years	All Rounder	9741440817	Regular	69	Y	69	Mithun Murthy
Mithun Reddy	37 years	All Rounder	9986646222	ICON	70	Y	70	Mithun Reddy
Mohamad Ali	28 years	All Rounder	9353264372	Regular	163	N	163	Mohamad Ali
Mohan M	24 years	Batsman	9148938382	Regular	71	Y	71	Mohan M
Mohan Rao	29 years	All Rounder	7014841335	Regular	72	Y	72	Mohan Rao
Mubarak Pasha	42 years	Batsman	6363462065	Regular	73	Y	73	Mubarak Pasha
Munikrishna	30 years	All Rounder	9739586978	Regular	74	Y	74	Munikrishna
Murugesh	27 years	Batsman	9980598523	Regular	75	Y	75	Murugesh
Murugesh M	32 years	Batsman	9739721772	Regular	76	Y	76	Murugesh M
Nagavendra M	37 years	All Rounder	8197661719	Regular	77	Y	77	Nagavendra M
Nagbhushan Reddy	37 years	Batsman	9980558899	Regular	78	Y	78	Nagbhushan Reddy
Nandan Chaitanya	39 years	Batsman	9964500100	Regular	79	Y	79	Nandan Chaitanya
Narayana Swamy	31 years	Batsman	9535689777	Regular	80	Y	80	Narayana Swamy
Narayanaswamy	42 years	All Rounder	9880296843	Regular	81	Y	81	Narayanaswamy
Naveen Kumar	31 years	All Rounder	8867282226	Regular	82	Y	82	Naveen Kumar
Naveen M	30 years	All Rounder	9902785999	Regular	83	Y	83	Naveen M
Naveen Reddy	42 years	All Rounder	9901096669	ICON	84	Y	84	Naveen Reddy
Nikhil Prabhakar	30 years	All Rounder	9591101802	Regular	85	Y	85	Nikhil Prabhakar
Nitesh S	30 years	All Rounder	9535991650	Regular	86	Y	86	Nitesh S
Nithin Kumar	29 years	All Rounder	8904774933	Regular	87	Y	87	Nithin Kumar
Noorulla	39 years	Batsman	9986188370	Regular	88	Y	88	Noorulla
Pradeep	44 years	Batsman	9845554410	Regular	89	Y	89	Pradeep
Pradeep BG	37 years	Bowler	9611494999	Regular	90	Y	90	Pradeep BG
Prajwal L	29 years	All Rounder	9071198321	Regular	91	Y	91	Prajwal L
Prajwal R	29 years	Batsman	9980804533	Regular	164	N	164	Prajwal R
Prakash	34 years	Batsman	9742715666	Regular	92	Y	92	Prakash
Praveen Kumar N	42 years	All Rounder	9880739393	Regular	93	Y	93	Praveen Kumar N
Punith V	23 years	All Rounder	6360452535	Regular	94	Y	94	Punith V
Rajesh R	37 years	All Rounder	9986634888	Regular	165	N	165	Rajesh R
Rajesh V	41 years	All Rounder	9880669969	Regular	95	Y	95	Rajesh V
Rama Chandra	42 years	All Rounder	9845976133	Regular	96	Y	96	Rama Chandra
Ramesh G	39 years	All Rounder	9972723408	Regular	166	N	166	Ramesh G
Ranjith	27 years	All Rounder	9686208176	Regular	97	Y	97	Ranjith
Ravi Kumar BK	39 years	Batsman	9611106928	Regular	98	Y	98	Ravi Kumar BK
Ravi Kumar L	43 years	Batsman	9606747403	Regular	99	Y	99	Ravi Kumar L
Ravindra	42 years	Batsman	9036110064	Regular	100	Y	100	Ravindra
Ravindranath	50 years	All Rounder	9986998229	Regular	101	Y	101	Ravindranath
Rohit Reddy	21 years	All Rounder	9972629127	Regular	102	Y	102	Rohit Reddy
Roshan	50 years	All Rounder	9886749342	Regular	103	Y	103	Roshan
Sachin G	29 years	Batsman	8217347563	Regular	167	N	167	Sachin G
Sachin N	28 years	Batsman	8073943636	Regular	104	Y	104	Sachin N
Sandeep Kumar	33 years	All Rounder	9538076343	Regular	105	Y	105	Sandeep Kumar
Sandeep Kumar S	35 years	All Rounder	9738342349	Regular	106	Y	106	Sandeep Kumar S
Sandeep Reddy	36 years	All Rounder	9980548880	Regular	107	Y	107	Sandeep Reddy
Sandeep Wadhawan	47 years	Batsman	9986015073	Regular	108	Y	108	Sandeep Wadhawan
Sanjay BK	29 years	All Rounder	8217853871	ICON	109	Y	109	Sanjay BK
Sanjay Kumar	28 years	Batsman	8147011437	Regular	110	Y	110	Sanjay Kumar
Sanjay Kumar Appi	30 years	Batsman	9019913566	Regular	111	Y	111	Sanjay Kumar Appi
Santhosh Reddy	41 years	All Rounder	9845372233	Regular	112	Y	112	Santhosh Reddy
Saravana	26 years	Batsman	9632322485	Regular	168	N	168	Saravana
Satyajit Reddy	22 years	All Rounder	9535533664	ICON	113	Y	113	Satyajit Reddy
Shankar M	32 years	Batsman	9742589701	Regular	114	Y	114	Shankar M
Sharanu V	23 years	All Rounder	7022731680	Regular	115	Y	115	Sharanu V
Shashank	23 years	Batsman	7795582288	Regular	116	Y	116	Shashank
Shashi Kumar	36 years	Batsman	9148849740	Regular	117	Y	117	Shashi Kumar
Shashidhar	32 years	Batsman	9148046396	ICON	118	Y	118	Shashidhar
Shashidhar	37 years	Batsman	9632541001	ICON	119	Y	119	Shashidhar
Shiva	38 years	All Rounder	9986675261	Regular	169	N	169	Shiva
Shiva C	28 years	All Rounder	9449777563	Regular	120	Y	120	Shiva C
Shiva Kumar N	43 years	All Rounder	9845079668	Regular	121	Y	121	Shiva Kumar N
Shiva Prasad	27 years	Batsman	7760218518	Regular	122	Y	122	Shiva Prasad
Shivanand	33 years	All Rounder	7204691096	Regular	170	N	170	Shivanand
Shivaraj K	40 years	Batsman	9916812444	Regular	123	Y	123	Shivaraj K
SHIVASHANKAR R	26 years	Batsman	9886070432	Regular	124	Y	124	SHIVASHANKAR R
Siddalinga	32 years	Batsman	9686229057	Regular	125	Y	125	Siddalinga
Sridhar	31 years	Batsman	9538658262	Regular	126	Y	126	Sridhar
Sridhar M	22 years	Batsman	9606575937	Regular	127	Y	127	Sridhar M
Srikanth	26 years	Batsman	9535053189	Regular	128	Y	128	Srikanth
Subramani	29 years	Batsman	6360937589	Regular	129	Y	129	Subramani
Subramani	30 years	Batsman	9902294137	Regular	130	Y	130	Subramani
Sudeep G	22 years	All Rounder	9538772943	ICON	131	Y	131	Sudeep G
Sujan Reddy B S	26 years	Batsman	9886335511	ICON	132	Y	132	Sujan Reddy B S
Suman Reddy	30 years	Batsman, Wicket Keeper	8296151789	Regular	133	Y	133	Suman Reddy
Sunil	35 years	Batsman	9964122322	Regular	171	N	171	Sunil
Sunil Diesel	45 years	Wicket Keeper	8317448327	Regular	134	Y	134	Sunil Diesel
Tarun Reddy	28 years	Batsman	7676761221	Regular	135	Y	135	Tarun Reddy
Uday Kiran	27 years	Batsman	7899049568	Regular	136	Y	136	Uday Kiran
Uday Kumar	39 years	Batsman	9880080119	Regular	172	N	172	Uday Kumar
Umesh BK	39 years	Batsman	9900100178	Regular	137	Y	137	Umesh BK
Vaibhav D	14 years	All Rounder	9900922363-1	Regular	138	Y	138	Vaibhav D
Varchas Reddy	24 years	All Rounder	9611360570	ICON	139	Y	139	Varchas Reddy
Vasanth Kumar	30 years	Batsman	9742060594	ICON	140	Y	140	Vasanth Kumar
Vikas	26 years	Batsman	7619518400	Regular	141	Y	141	Vikas
Vinay	27 years	Batsman	9742321215	Regular	142	Y	142	Vinay
Vinay G	25 years	Batsman	8123265156	Regular	143	Y	143	Vinay G
Vinay Kumar	29 years	All Rounder	9113941421	Regular	173	N	173	Vinay Kumar
Vishwas R	28 years	All Rounder	7676762367	Regular	144	Y	144	Vishwas R
VR Kshatriya	34 years	All Rounder	9632138055	Regular	145	Y	145	VR Kshatriya
Yash	26 years	Batsman	9008659880	Regular	146	Y	146	Yash
Yeshwanth B S	27 years	Batsman	8073713026	Regular	147	Y	147	Yeshwanth B S
Yeshwanth V	29 years	Batsman	9535500446	Regular	148	Y	148	Yeshwanth V
Yuvaraj	27 years	Batsman	9620310245	Regular	149	Y	149	Yuvaraj'''

# Parse the data
players = []
for line in data.strip().split('\n'):
    parts = line.split('\t')
    if len(parts) >= 9:
        name = parts[0].strip()
        age = parts[1].strip()
        category = parts[2].strip()
        phone = parts[3].strip()
        player_type = parts[4].strip()
        auction_serial = parts[5].strip()
        is_valid = parts[6].strip()
        jersey_num = parts[7].strip()
        jersey_name = parts[8].strip()
        players.append((name, age, player_type, phone, auction_serial, is_valid, jersey_num, jersey_name))

# Generate SQL
sql_lines = []
sql_lines.append('-- Migration: Update player data with name, age, player_type, auction_serial_number, is_valid_player, jersey_number, and jersey_name')
sql_lines.append('-- Updates existing players based on phone number')
sql_lines.append('')
sql_lines.append('-- Update players data')

for name, age, player_type, phone, auction_serial, is_valid, jersey_num, jersey_name in players:
    # Escape single quotes in names
    name_escaped = name.replace("'", "''")
    age_escaped = age.replace("'", "''")
    jersey_name_escaped = jersey_name.replace("'", "''")
    sql = f"UPDATE players SET name = '{name_escaped}', age = '{age_escaped}', player_type = '{player_type}', auction_serial_number = {auction_serial}, is_valid_player = '{is_valid}', jersey_number = {jersey_num}, jersey_name = '{jersey_name_escaped}' WHERE phone = '{phone}';"
    sql_lines.append(sql)

# Write to file
with open('supabase/migrations/003_update_player_data.sql', 'w') as f:
    f.write('\n'.join(sql_lines))

print(f'Generated SQL file with {len(players)} UPDATE statements')
