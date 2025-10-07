# Agro-Karfi
## The Problem
Northern Nigeria holds at least [70% of Nigeria's arable land](https://dailytrust.com/northern-nigeria-the-sleeping-giant-that-could-unlock-nigerias-trillion-dollar-economy/). It is the backbone of the nation’s agriculture fuelling a colossal portion Nigeria’s food supply. But farmers here face a [hard reality](https://humanglemedia.com/farmers-in-northern-nigeria-threatened-by-erratic-rainfall-insecurity/#:~:text=Farmers%20In%20Northern%20Nigeria%20Threatened,destruction%20of%20farmlands%20and%20crops.): rains no longer come when expected, soils are losing fertility, and desertification is eating away at once-productive land. Without knowing the right time to plant or harvest, thousands of farmers waste effort and lose yields every season. Food insecurity grows, and Nigeria loses billions in agricultural trade and revenue both locally and across borders.

Tackling this issue of lack of knowledge of optimal farming seasons requires an intelligent data-driven system to recommend the best crop for farmers in Northern Nigeria based on agro-climatic and environmental factors. The goal thereof is to improve agricultural productivity, reduce risk from climate variability, and enhance food security across the region which is highly affected by unpredictable weather patterns and unstable weather anomalies.

## The Innovation
Our solution, **Agro Karfi**, is a smart farming platform designed for Northern Nigeria's smallholder farmers. It combines artificial intelligence, satellite data, and local weather and soil insights to guide farmers on the best times to plant and harvest. In order to establish better relationship with the farmers along with better results, the platform has been designed to produce findings in the dominant language of the north (Hausa). Through this Hausa AI assistant, farmers get instant, practical advice ranging from pest control to market access — in a way that feels familiar and accessible.

The innovation driving this novel platform comes in 4 distinct facets:
-	**Farm Mapping:** This is the initial phase of record taking within Agro Karfi where the farmer draws boundary of his farm via this user-friendly application.
-	**Remote Sensing Analysis:** Agro Karfi carefully reads archives of satellite images, analyses rainfall patterns, checks soil health and other variables that are key for optimal results.
-	**AI Predictions:** Through a robust model trained on a vast collection of northern Nigeria research on agriculture **Retrieval Augmented Generation**, AI predictions are run for optimal planting and harvesting time.
-	**Local Language Advice:** Given the target demographic, Agro Karfi is able to give farmers guidance in Hausa: "Shuka daga 15 ga watan Yuni zuwa 22 ga watan Yuni. Za ku sami sakamako mai kyau". 

## The How
**Agro Karfi** is a web application that can be accessed by clicking [here](https://agro-karfi-1.onrender.com/). For a smooth experience, the following steps should be followed:
- On loading the application, click on ```Start Mapping Free``` to create your unique farmer account.
<img width="1366" height="605" alt="Login Signup" src="https://github.com/user-attachments/assets/8bea81ba-9ba3-42c0-b990-eafb8852719c" />
 
- When directed to the ```sign-up``` page, enter your data i.e ```First Name``` , ```Last Name``` , ```State```, ```Fertilizer Use``` (in terms of how often one makes of fertiliser in the farming season), ```Pesticide Use``` (based on how often pesticides are used on the farm) and ```Irrigated Area``` of the farm and finally click on ```Continue to Map```.
<img width="1366" height="604" alt="Sign Up" src="https://github.com/user-attachments/assets/8f5c9076-ad1e-425c-94d2-4622686d96b4" />

- This will take you to the  ```map``` screen where you are prompted to allow for access of location services in order to get the proper satellite capturing of the map. You have to allow the location services automatically find you on the map for better services. After this is done, draws a polygon of the area your farm is situated in and the system processes this polygon along with the earlier inputted data to give you an in-depth field analysis and prediction powered by AI and a predictive model.

<img width="1358" height="640" alt="Mapping" src="https://github.com/user-attachments/assets/c4fb265e-468d-4086-a8c1-07eaa98b9fe6" />


<img width="584" height="329" alt="Analysis and Prediction" src="https://github.com/user-attachments/assets/a080ec56-bca7-49f1-bdd1-261f2fcebae4" />

This analysis, catered to the user's location, consists of average temperature of the area, soil PH, optimal crop prediction, total land area, date of calculation, average annual rainfall and satellite analysis for better visual insights for the farmer. A very interesting aspect of this analysis is also the smart farming advice provided by the use of LLM. With these insights, as well as **AI-Powered** farm recommendations, better yields for crops across all farming seasons are ensured for farmers.

## The Impact
**Agro Karfi** was designed with not just farmers’ interest in mind but the growth of the nation at large. With Agro Karfi, the agricultural sector of the nation stands to gain higher yields thereby enabling more food supply, better incomes especially for smallholder farmers, reduced risks within the farming business and most importantly global competitiveness in the sense that Nigeria is positioned as a global leader, not a follower, in agricultural exports.

### Sources:
- [Daily Trust](https://dailytrust.com/northern-nigeria-the-sleeping-giant-that-could-unlock-nigerias-trillion-dollar-economy/)
- [FARA Africa](https://faraafrica.org/2024/05/08/addressing-declining-soil-fertility-in-africa-amid-population-surge/)
- [Food and Agriculture Organization](https://www.fao.org/fileadmin/user_upload/GSP/docs/WS_managinglivingsoils/Status_Soil_Management_Nigeria_Ojuola.pdf)
- [The Nation Newspaper](https://thenationonlineng.net/nigerias-prosperity-inseparable-from-future-of-northern-nigeria-tinubu/)



### Running the Application Locally:
To run this application locally :<br> 
* Use `git clone https://github.com/ImperiumBuild/Agro-Karfi.git` to clone the repository locally.
* Then `cd Agro-Karfi` to enter into the project folder.
* Run `pip install requirements.txt` to install the modules.
* Create a .env file and the neccesary variables can be given to you by any of the team members.
* Run `uvicorn main:app --reload` to run the local server.
* Run `cd frontend-map` to change directory to the frontend part of the code.
* Run `npm install` then `npm run dev` to start the frontend server.
* The link is usually `http://localhost:3000` depending on the port available on your system.