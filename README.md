# US Vote Deadlines Calculator Documentation
##### Built in January 2021 by Jalia Evans

## [Live site of API](https://main.d1330uqkw3jlf8.amplifyapp.com/)

## Front End
### Data Entry Notes
* Stop using “same” when entering information. Copy and paste the content if it’s the same.
* If you’re going to format a spreadsheet for entering into the database, follow the formatting of the “Database-Friendly” directions to clean the data. It is not a lot of work and requires no programming experience.
* Make sure that each row in the spreadsheet has the state’s name. The row needs to have the state name because each row is entered into the database one by one.
* Update BOTH the GoogleSheets page and the calculator when you’re looking to update information. The GoogleSheet is a good backup for the calculator in case Amplify or DynamoDB lose support, and the database is a good backup in case the GoogleSheet is compromised.

### Database Backup
* To download backup of database, you go to the dynamoDB database table: State-f2jbkneporaojpugeuji4qit5u-staging
	1. Use sidebar to go to ‘Explore Items’
	2. Open the dropdown that says “Scan/Query items”. It will show text above the database items that will tell you if all of the items are loaded yet. Click “Retrieve Next Page” until the text disappears. Now you will have all of the items in the database ready for download.
	3. Go to actions and press “download results to CSV”
	4. Then open the CSV in excel or google sheets
	5. I’d recommend backing the database up every month or so, just to make sure things are kept up to date.
* The database information is available in both CSV and JSON (just use a CSV to JSON converter online), and so it should be easy to push results into the US Vote API in the future for someone who writes in python
* If you have access to the code and are comfortable committing to Github, you can add the CSV to the election_formulas/legacy_files folder. 
	* Title it “calculator_content_{month_year}”. 
	* It’s not necessary, but might be good practice for the future. Make sure that you commit to Github after you add it.


## Back End
### AWS Amplify Console / DynamoDB
* Front End of Amplify is in N. Virginia, back end (DynamoDB) Is in N. Virginia
* Database table name: State-f2jbkneporaojpugeuji4qit5u-staging

### API Key
* Amazon AppSync (in the backend panel of the amplify console for the app) will reset the API Key on January 7th, 2023. To reset it, go to the AppSync backend, create a new API Key and select it as the new one. Delete the old API key. Make sure to name the API Key in the description field, it will make things easier for others to read. You shouldn't need to give everyone new API Key, the app itself should manage it when it's running.

### Committing code
* If you’ve just committed code to the GitHub, wait 5-10 minutes to make sure the live site has finished the build and deployed again. You can check the progress in the Amplify Console App’s Hosting Environment.
* If you’re having issues, read the build logs.


### Mass addition to or mass emptying of the Database
1. Find the spreadsheet and make sure it’s updated.
2. Clean the spreadsheet to make sure the formatting matches up.
3. Download the spreadsheet.
4. Upload the spreadsheet to a [CSV to JSON converter](https://csvjson.com/) (try this link, if it doesn't work anymore just google one and use it).
5. Download the JSON converted file.
6. Run scripts locally
	1. Clone the repository to your computer.
		* Connect yourself to the GitHub with a Personal Access Token in the collaborators if you intend to change the code of the calculator’s live version. If you don’t intend to modify the calculator for the entire foundation, don’t worry about that.
		* You do not need to commit any code to mass add or mass delete from the database. The calls are made as local API calls, they do not need to be from the live site to work.
	2. Terminal commands:
		1. Enter “npm install” to initialize the packages on your machine
		2. Enter “npm start” to get the local version of the site running on your machine. The browser window should open itself once the script is started.
		3. Let the terminal keep running, the npm start needs to be continuing because it’s supporting your local version of the site. If you need to run more commands in the terminal while the React site is running, open a new terminal.
	3. Move the new/cleaned JSON file to the election_formulas folder and title it converted_calculator.JSON
	4. Go to App.js and comment out SearchForm, remove the comments that keep AddDelete from being connected
	5. Go to the browser and open the inspect tab to see the console. It will show any errors if there are any, and there are console.logs to let you know what stage things are at as you are uploading/deleting content from the database.
	6. When you’re done modifying the mass content in the database, go back into App.js and comment out “AddDelete” and uncomment “SearchForm” to get the application back to its normal state.
7. Check “git status” in your terminal to make sure you reversed anything you changed. If there are files that have been changed, figure out where the differences are and reset those changes on your local branch.
8. You should be good to go!
9. When you’re running the scripts to mass add/clear the database, it can take a few minutes. There is a progress bar, but if you’re concerned that something has gone wrong, open the console in the window and check for error methods. I’ve added lots of console logs to let you know where the server is in the process so it will be easy to see if the process is just taking a while or there was an error in the scripts.

### Troubleshooting
* If you want to check and see if all of the items you’ve uploaded or deleted made it into the database, scroll to the bottom of your spreadsheet to see the total number of lines. Then go to the AWS DynamoDB site and check that number against the item count in the table. It should likely be the count of your spreadsheet - 1 (because the spreadsheet has a top row with the column headers inside it). At the end of the Add and Delete pages in the browser, there should be text that tells you how many items you added or deleted. Check that number against your spreadsheet number - 1 and you should have the same number. If not, check the console for any error messages.
* When you are in the mass AddDelete mode of the site, look in the console and reload the page. It will tell you how many items it can see that are in the database.
* If, for some reason, you get more than 3000 lines in your spreadsheet, then find the graphQL calls in the application that have a {limit: 3000} property in the graphQL API calls and increase that number as you need. I’m not sure what the maximum is, but it should be enough to cover whatever you need. If not, google “mass calls to graphQL databases” and see if there is a new solution. This is extremely unlikely to happen, but just in case.
* The technologies in the stack are:
	* Amplify in AWS for the API
	* DynamoDB in AWS for the database
	* It is a REST API
	* GraphQL for the database structure/interaction
	* JSON for the data structure
	* React.js for the front end framework
* If you get stuck, email me at evans.jalia@gmail.com and I’ll see what I can do to help. Stack overflow and google are also your friends.

### Helpful links if you run into trouble
* [Working with Data in DynamoDB from React with AWS Amplify](https://www.youtube.com/watch?v=kqi4gPfdVHY&t=687s&ab_channel=CompleteCoding)
* [Building the GraphQL Database](https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/module-four/?e=gs2020&p=build-a-react-app-intro)