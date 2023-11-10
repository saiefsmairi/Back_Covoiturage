# EY_RideSharing
<br/>
<p align="center">
  <h3 align="center">EY_RideSharing</h3>

</p>


## Built With

React native ,Dotnet ,SQLServer, Expo , Ngrok , Swagger


## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

2. Clone the repo

```sh
git clone https://github.com/saiefsmairi/EY_RideSharing/new/saifsmairi
```
3. Let's start running the backend first :

we have 4 microservices and each is developed in a seperate project each MS have its own database and they are all connected with an Api gateway : Auth_Microservice,Carpooling_Microservice,User_Microservice,GatewayService.

3.1 Make migrations and create the databases

in order to create the databases for the carpooling_Microservice and User_Microservice we need to run these commands in the package manager console in visual studio :

```sh
Add-Migration YourMigrationName
```

```sh
Update-Database
```
4. Run all microservices and that's it ;)

Before we move on to the front end we need to run all the 4 microservices simultaneously .

5. Ngrok

Using ngrok to expose your local API server to the internet, especially during development when you want to test interactions between a backend (in this case, your .NET API) and a frontend (such as a React Native app) running on a mobile device or emulator.

5.1. download ngrok and create an account 

5.2. All the microservices must be running !!

5.3. we need to modify the config file of the ngrok.yml and its located in this path :
```sh
AppData\Local\ngrok
```
we need to modify the content like this :
```JS
version: "2"
authtoken: [put here your token]
tunnels:
  gatewayServer:
    proto: http
    addr: 5258
  notifServer:
    proto: http
    addr: 5243    
```
5.4. now lets go back to the ngrok.exe situated in the folder downloaded earlier and run ngrok.exe and run this command :

```sh
ngrok start --all
```
and you will get this result with other informations : 
Forwarding                    https://63a6-102-156-16-113.ngrok-free.app -> http://localhost:5243           
Forwarding                    https://a955-102-156-16-113.ngrok-free.app -> http://localhost:5258   
we are always intrested with the second url , this url : " a955-102-156-16-113.ngrok-free.app "  represents "http://localhost:5258" and in the front end we will use it instead of the localhost

6. now for the frontend :

let's hit CTRL+H and replace the old url "https://3d7f-102-156-193-206.ngrok-free.app" with the new generated url from ngrok

6.1. Run the project with :

```JS
npm start;
```
and scan the generated qrCode with expo app . 

That's it :D


## License

Distributed under the MIT License. See [LICENSE](https://github.com/ShaanCoding/EY_RideSharing/blob/main/LICENSE.md) for more information.

## Authors

* **Saif Smairi** - *FullStak dev* - [Saif Smairi](https://github.com/saiefsmairi) - **


