########################################
   ABOUT
########################################
Predicate builder for the Quantum Metric Code Challenge.
A predicate consists of a field, comparator, and comparator values.
There is no limit to the number of predicates which can be added to the screen.


########################################
   CONFIGURING SQL DATABASE CONNECTION
########################################
(optional but recommended to see SQL results in UI table)
See /api/session/data.js.
Update the following object with the correct host, user, password, and database name:
    const SqlInfo = {
        tableName: 'session',
        connection: {
            host: 'localhost',
            user: 'quantummetric',
            password: 'challenge',
            database: 'quantum_metric'
        }
    };


########################################
   STARTING THE SERVER
########################################
Run the following command:
    npm start


########################################
   LAUNCHING THE USER INTERFACE
########################################
    Open your favorite browser to http://ipaddress:8080
    See config.js to change the port #.
    Browser must have JavaScript enabled.


########################################
   USAGE NOTES
########################################
Comparators "in list", "not in list" and "contains all" expect a COMMA-AND-SPACE-separated value.

Example #1
Given UI input: [Domain] [in list] [domain1.com, domain2.com]
Query results will contain rows where the domain is equal to "domain1.com" OR "domain2.com" (exact string match).

Example #2
Given UI input: [Domain] [in list] [domain1.com,domain2.com]
Query results will contain rows where the domain is equal to "domain1.com,domain2.com".
Notice there is no space after the comma which results in "domain1.com,domain2.com" being treated as a single value.

Example #3
Given UI input: [Domain] [contains all] [do, main, .com]
Query results will contain rows where the domain contains ALL substrings "do", "main", AND ".com".


########################################
   CONTACT
########################################
Send feedback or questions to Eric Ho at cyberrian@gmail.com
Thank you!
