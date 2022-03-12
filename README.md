# ControlpanelAllocationManager
 
### What does it do? 
This program dedects if a node is over a certain limit of its allocated resources and will remove the products liked to the node from controlpanel.  
It will check disk and memory allocations.

## DISCLAIMER
This Software directly messes with your products!   
On FIRST startup it will sync all your products and based on THIS information it will delete / restore the products from now on.  
IF YOU WANT TO MODIFY YOUR PRODUCTS [PLEASE FOLLOW THEGUIDE](#updating-products)!  

## Example:
1: Node 1 has 8GB of RAM total and has 1 server with 4GB already allocated.  
2: Client adds new server to that node with 3GB RAM.  
3: Program dedects that 7GB / 8GB is over 80% allocation and removed all products for that node. (Now its not possible for clients to add mode servers on that node)  
4: Client removes his 3GB server from that node.  
5: Program dedects that its now only 4GB / 8GB used and adds the products back to the node.  

## Install
```sh
git clone https://github.com/BolverBlitz/ControlpanelAllocationManager.git
cd ./ControlpanelAllocationManager
npm i
mv ./.env.example ./.env
```
Please note, the database user needs R/W to controlpanel DB and R from pterodactyl!  
Now fill the .env file `nano .env` with the database login and configure however you like it.  
I recomend setting the CheckDelayInMS to at least 10 seconds, for bigger hosts even higher.  

## Running
```sh
node index.js
```

### Running it with PM2
```sh
pm2 start index.js --name="<Name you like>"
```

## Updating Products
1: Make sure the software is running and verify no node is above its set limit.  
2: Stop the software
```sh
pm2 stop <Name you like>
# If you forgot the name, check with:
pm2 ls
```
3: Delete the file `node_producs.json` in `./storage` folder  
4: Make your modifications to the producs.  
5: Start the software again
